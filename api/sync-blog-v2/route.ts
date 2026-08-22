import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://somatgspsqxtpfblsjib.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Generar slug desde título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: Request) {
  try {
    const article = await request.json();
    const slug = article.slug || generateSlug(article.title);

    const { data, error } = await supabase
      .from('blog_articles')
      .upsert(
        {
          slug,
          title: article.title,
          intro: article.intro || '',
          body: article.body || article.body_blog || '',
          tag: article.tag || '',
          photoFile: article.photoFile || '',
          status: 'published',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      )
      .select();

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: '¡Artículo publicado! 🔥', data },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Sync Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(
      { posts: data || [] },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: error.message, posts: [] },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { slug } = await request.json();
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug requerido' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { error } = await supabase
      .from('blog_articles')
      .delete()
      .eq('slug', slug);

    if (error) throw error;

    return NextResponse.json(
      { success: true, message: 'Artículo eliminado' },
      { headers: CORS_HEADERS }
    );
  } catch (error: any) {
    console.error('Delete Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

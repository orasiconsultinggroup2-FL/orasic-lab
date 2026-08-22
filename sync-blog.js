// Sincronización de artículos del Content Studio al blog publicado
const BLOG_API = '/api/sync-blog-v2';

async function publishBlogArticle(article) {
  try {
    const response = await fetch(BLOG_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    return { success: true, message: result.message, data: result.data };
  } catch (error) {
    console.error('Error publishing article:', error);
    return { success: false, error: error.message };
  }
}

async function loadBlogArticles() {
  try {
    const response = await fetch(BLOG_API);
    const result = await response.json();
    return result.posts || [];
  } catch (error) {
    console.error('Error loading articles:', error);
    return [];
  }
}

async function deleteBlogArticle(slug) {
  try {
    const response = await fetch(BLOG_API, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug }),
    });

    const result = await response.json();
    if (!result.success) throw new Error(result.error);

    return { success: true, message: result.message };
  } catch (error) {
    console.error('Error deleting article:', error);
    return { success: false, error: error.message };
  }
}

// Exponer globalmente
if (typeof window !== 'undefined') {
  window.blogSync = {
    publish: publishBlogArticle,
    load: loadBlogArticles,
    delete: deleteBlogArticle,
  };
}

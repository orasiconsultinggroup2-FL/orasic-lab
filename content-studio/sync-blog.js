const blogSync = {
  async publish(article) {
    try {
      const response = await fetch('/api/publish-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      });
      return await response.json();
    } catch (err) {
      console.error('Blog sync error:', err);
      return { success: false, error: err.message };
    }
  }
};

window.blogSync = blogSync;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import Image from "../../components/AppImage";
import { blogApi } from "../../utils/blogApi";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const loadBlogData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch the blog data
        const blogData = await blogApi.getById(id);
        
        if (!blogData) {
          throw new Error('Blog not found');
        }
        
        setBlog(blogData);
        
        // Fetch related blogs (same category, exclude current)
        try {
          const allBlogs = await blogApi.getAll();
          const related = allBlogs
            .filter((b) => b._id !== id && b.category === blogData.category && b.status === 'published')
            .slice(0, 3);
          setRelatedBlogs(related);
        } catch (relatedError) {
          console.warn('Failed to load related blogs:', relatedError);
          // Don't fail the whole page if related blogs fail
        }
        
      } catch (err) {
        console.error('Error loading blog:', err);
        setError(err.message || "Failed to load blog");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadBlogData();
    } else {
      setError("No blog ID provided");
      setIsLoading(false);
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading article...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <Icon name="FileX" size={48} className="text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Article Not Found</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <div className="bg-slate-100 text-xs text-left p-4 rounded max-w-xl mx-auto overflow-x-auto mb-4">
            <div><strong>Blog ID:</strong> {id}</div>
            <div><strong>Error:</strong> {error}</div>
            <div><strong>Blog Data:</strong> {blog ? JSON.stringify(blog, null, 2) : 'null'}</div>
          </div>
          <Button
            variant="default"
            onClick={() => navigate("/blog")}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  // No blog data (but no error)
  if (!blog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Icon name="AlertTriangle" size={48} className="text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Blog Data</h2>
          <p className="text-slate-600 mb-6">Blog data is not available.</p>
          <Button
            variant="default"
            onClick={() => navigate("/blog")}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  // Show warning if required fields are missing
  if (!blog.content || !blog.title) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <Icon name="AlertTriangle" size={48} className="text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Blog Data Incomplete</h2>
          <p className="text-slate-600 mb-6">This blog is missing required fields.</p>
          <div className="bg-slate-100 text-xs text-left p-4 rounded max-w-xl mx-auto overflow-x-auto mb-4">
            <div><strong>Missing fields:</strong></div>
            {!blog.title && <div>- Title</div>}
            {!blog.content && <div>- Content</div>}
            <div className="mt-2"><strong>Available data:</strong></div>
            <pre>{JSON.stringify(blog, null, 2)}</pre>
          </div>
          <Button
            variant="default"
            onClick={() => navigate("/blog")}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  // Format date helper function
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Return original if parsing fails
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="pt-24 pb-8 md:pb-12">
        <div className="max-w-3xl md:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex flex-wrap items-center space-x-2 text-sm text-slate-600 mb-4 md:mb-6">
            <Link to="/blog" className="hover:text-primary transition-colors duration-200">Blog</Link>
            <Icon name="ChevronRight" size={14} />
            <span className="text-slate-400">{blog.category}</span>
            <Icon name="ChevronRight" size={14} />
            <span className="text-slate-400 truncate max-w-[120px] md:max-w-xs">{blog.title}</span>
          </div>
          {/* Category Badge */}
          <div className="flex items-center space-x-2 mb-3">
            <span className="inline-flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
              <span>{blog.category}</span>
            </span>
          </div>
          {/* Title */}
          <h1 className="text-2xl md:text-4xl font-bold text-slate-800 mb-4 md:mb-6 leading-tight break-words">{blog.title}</h1>
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-slate-600 mb-4 md:mb-8">
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{formatDate(blog.publishDate || blog.createdAt)}</span>
            </div>
            <div>
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border bg-white border-slate-200 text-slate-600 hover:bg-slate-50 transition-all duration-200"
              >
                <Icon name="Share2" size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Image */}
      {blog.image && (
        <section className="max-w-3xl md:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12">
          <div className="rounded-2xl overflow-hidden shadow-lg bg-white p-2 md:p-4">
            <Image
              src={blog.image}
              alt={blog.title}
              className="w-full h-56 md:h-96 object-cover rounded-xl"
              style={{ objectFit: "cover" }}
            />
          </div>
        </section>
      )}
      {/* Article Content */}
      <section className="max-w-3xl md:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 md:mb-16">
        <div className="bg-white rounded-xl shadow p-4 md:p-8">
          <div className="prose prose-slate prose-lg max-w-none break-words">
            <div
              dangerouslySetInnerHTML={{ __html: blog.content }}
              className="text-slate-700 leading-relaxed"
            />
          </div>
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-200">
              <h3 className="text-base font-semibold text-slate-800 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-slate-100 text-slate-600 text-xs md:text-sm rounded-full hover:bg-primary/10 hover:text-primary transition-colors duration-200 cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="py-10 md:py-16 bg-white/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 md:mb-4">
                Related <span className="brand-gradient-text">Articles</span>
              </h2>
              <p className="text-base md:text-xl text-slate-600">
                Continue exploring {blog.category?.toLowerCase()} topics
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {relatedBlogs.map((relatedBlog) => (
                <div
                  key={relatedBlog._id || relatedBlog.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/50 hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-300 flex flex-col"
                  onClick={() => navigate(`/blogs/${relatedBlog._id || relatedBlog.id}`)}
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={relatedBlog.image}
                      alt={relatedBlog.title}
                      className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center space-x-1 px-2 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs rounded-full">
                        <span>{relatedBlog.category}</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-4 md:p-6 flex-1 flex flex-col">
                    <h3 className="text-base md:text-lg font-semibold text-slate-800 mb-1 md:mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-slate-600 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2 flex-1">
                      {relatedBlog.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
                      <span>{formatDate(relatedBlog.publishDate || relatedBlog.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogDetail;

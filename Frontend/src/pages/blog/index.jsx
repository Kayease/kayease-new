import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import BlogHero from "./components/BlogHero";
import CategoryFilter from "./components/CategoryFilter";
import FeaturedPost from "./components/FeaturedPost";
import BlogCard from "./components/BlogCard";
import SearchBar from "./components/SearchBar";
import Pagination from "./components/Pagination";
import Icon from "../../components/AppIcon";
import LoadingSpinner from "../../components/LoadingSpinner";
import BlogCardSkeleton from "./components/BlogCardSkeleton";
import FeaturedPostSkeleton from "./components/FeaturedPostSkeleton";
import Toast from "../../components/Toast";
import { blogApi } from "../../utils/blogApi";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [blogPosts, setBlogPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [featuredPost, setFeaturedPost] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const postsPerPage = 9;

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all blogs
        const blogs = await blogApi.getAll();
        
        // Filter only published blogs
        const publishedBlogs = blogs.filter(blog => blog.status === 'published');
        
        setBlogPosts(publishedBlogs);
        
        // Set featured post (first featured blog or first blog)
        const featured = publishedBlogs.find(blog => blog.featured) || publishedBlogs[0];
        setFeaturedPost(featured);
        
        // Generate categories from blog data
        const categoryMap = new Map();
        categoryMap.set('all', { id: 'all', name: 'All Posts', icon: 'Grid', count: publishedBlogs.length });
        
        publishedBlogs.forEach(blog => {
          if (categoryMap.has(blog.category)) {
            categoryMap.get(blog.category).count++;
          } else {
            categoryMap.set(blog.category, {
              id: blog.category.toLowerCase().replace(/\s+/g, '-'),
              name: blog.category,
              icon: getCategoryIcon(blog.category),
              count: 1
            });
          }
        });
        
        setCategories(Array.from(categoryMap.values()));
        setConnectionStatus('connected');
        
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message || 'Failed to fetch blogs');
        setConnectionStatus('error');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Web Development': 'Code',
      'Mobile Technology': 'Smartphone',
      'E-commerce Trends': 'ShoppingCart',
      'Digital Strategy': 'Target',
      'Case Studies': 'FileText',
      'Technology': 'Cpu',
      'Design': 'Palette',
      'Business': 'Briefcase',
    };
    return iconMap[category] || 'BookOpen';
  };

  // Filter posts based on category and search term
  useEffect(() => {
    let filtered = blogPosts;

    if (activeCategory !== "all") {
      const categoryName = categories.find(
        (cat) => cat.id === activeCategory
      )?.name;
      filtered = filtered.filter((post) => post.category === categoryName);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.tags && post.tags.some(tag => 
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ))
      );
    }

    setFilteredPosts(filtered);
    setCurrentPage(1);
  }, [activeCategory, searchTerm, blogPosts, categories]);

  // Pagination
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = filteredPosts.slice(
    startIndex,
    startIndex + postsPerPage
  );

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      // Fetch all blogs
      const blogs = await blogApi.getAll();
      
      // Filter only published blogs
      const publishedBlogs = blogs.filter(blog => blog.status === 'published');
      
      setBlogPosts(publishedBlogs);
      
      // Set featured post (first featured blog or first blog)
      const featured = publishedBlogs.find(blog => blog.featured) || publishedBlogs[0];
      setFeaturedPost(featured);
      
      // Generate categories from blog data
      const categoryMap = new Map();
      categoryMap.set('all', { id: 'all', name: 'All Posts', icon: 'Grid', count: publishedBlogs.length });
      
      publishedBlogs.forEach(blog => {
        if (categoryMap.has(blog.category)) {
          categoryMap.get(blog.category).count++;
        } else {
          categoryMap.set(blog.category, {
            id: blog.category.toLowerCase().replace(/\s+/g, '-'),
            name: blog.category,
            icon: getCategoryIcon(blog.category),
            count: 1
          });
        }
      });
      
      setCategories(Array.from(categoryMap.values()));
      setConnectionStatus('connected');
      
      // Show success toast
      setToast({
        message: "Blogs refreshed successfully!",
        type: "success"
      });
      
    } catch (err) {
      console.error('Error refreshing blogs:', err);
      setConnectionStatus('error');
      setToast({
        message: err.message || 'Failed to refresh blogs',
        type: "error"
      });
    } finally {
      setRefreshing(false);
    }
  };

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <BlogHero />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <Icon
              name="AlertCircle"
              size={48}
              className="text-red-400 mx-auto mb-4"
            />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Failed to load blogs
            </h3>
            <p className="text-slate-600 mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // JSON-LD structured data for blog page
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://kayease.com/#organization",
        "name": "Kayease Global",
        "url": "https://kayease.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037058/Kayease.logo_zrgbwp.png"
        }
      },
      {
        "@type": "Blog",
        "@id": "https://kayease.com/blog/#blog",
        "url": "https://kayease.com/blog",
        "name": "Tech Talk | Kayease Global Blog - Digital Trends & Solutions",
        "description": "Stay updated with the latest digital trends, technology insights, and industry best practices. Expert articles on web development, mobile apps, digital marketing, and technology solutions.",
        "publisher": {
          "@id": "https://kayease.com/#organization"
        },
        "mainEntityOfPage": {
          "@id": "https://kayease.com/blog/#webpage"
        },
                 "blogPost": blogPosts.map(blog => ({
          "@type": "BlogPosting",
          "@id": `https://kayease.com/blog/${blog.slug}`,
          "headline": blog.title,
          "description": blog.excerpt,
          "author": {
            "@type": "Person",
            "name": blog.author || "Kayease Global Team"
          },
          "publisher": {
            "@id": "https://kayease.com/#organization"
          },
          "datePublished": blog.createdAt,
          "dateModified": blog.updatedAt,
          "image": blog.featuredImage || "https://res.cloudinary.com/dzf79cfv6/image/upload/v1754037058/Kayease.logo_zrgbwp.png",
          "articleBody": blog.content,
          "wordCount": blog.content ? blog.content.split(' ').length : 0,
          "keywords": blog.tags ? blog.tags.join(', ') : "digital technology, web development, mobile apps, digital marketing",
          "mainEntityOfPage": {
            "@id": `https://kayease.com/blog/${blog.slug}`
          }
        }))
      },
      {
        "@type": "WebPage",
        "@id": "https://kayease.com/blog/#webpage",
        "url": "https://kayease.com/blog",
        "name": "Tech Talk | Kayease Global Blog - Digital Trends & Solutions",
        "description": "Stay updated with the latest digital trends, technology insights, and industry best practices. Expert articles on web development, mobile apps, digital marketing, and technology solutions.",
        "isPartOf": {
          "@id": "https://kayease.com/#website"
        },
        "about": {
          "@id": "https://kayease.com/#organization"
        },
        "mainEntity": {
          "@id": "https://kayease.com/blog/#blog"
        }
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Tech Talk | Kayease Global Blog - Digital Trends & Solutions</title>
        <meta
          name="description"
          content="Stay ahead with Kayease Global's expert insights on digital trends, web development, mobile apps, and technology solutions. Read our latest articles and case studies."
        />
        <meta
          name="keywords"
          content="blog, digital trends, web development, mobile apps, technology, digital marketing, case studies, tech insights, digital strategy, innovation"
        />
        <meta property="og:title" content="Tech Talk | Kayease Global Blog - Digital Trends & Solutions" />
        <meta
          property="og:description"
          content="Stay ahead with expert insights on digital trends, web development, mobile apps, and technology solutions."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://kayease.com/blog" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <BlogHero />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8">
          {/* Main Content Area */}
          <div>
            {/* Search Bar */}
            <SearchBar onSearch={handleSearch} />

            {/* Category Filter */}
            {loading ? (
              <div className="mb-8">
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-10 bg-slate-200 rounded-full w-32 animate-pulse flex-shrink-0"></div>
                  ))}
                </div>
              </div>
            ) : (
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
            )}

            {/* Featured Post */}
            {!searchTerm && activeCategory === "all" && (
              <>
                {loading ? (
                  <FeaturedPostSkeleton />
                ) : featuredPost ? (
                  <FeaturedPost post={featuredPost} />
                ) : null}
              </>
            )}

            {/* Results Header */}
            {loading ? (
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="h-8 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded w-32 animate-pulse"></div>
              </div>
            ) : (
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    {searchTerm
                      ? `Search Results for "${searchTerm}"`
                      : activeCategory === "all"
                      ? "Latest Articles"
                      : categories.find((cat) => cat.id === activeCategory)?.name}
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {filteredPosts.length} article
                    {filteredPosts.length !== 1 ? "s" : ""} found
                  </p>
                </div>

                {/* Connection Status and Controls */}
                <div className="flex items-center space-x-3">
                  {/* Connection Status */}
                  {!loading && (
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        connectionStatus === 'connected' ? 'bg-green-500' : 
                        connectionStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <span className="text-xs text-slate-500">
                        {connectionStatus === 'connected' ? 'Live' : 
                         connectionStatus === 'error' ? 'Offline' : 'Connecting'}
                      </span>
                    </div>
                  )}
                  
                  {/* Sort Options and Refresh */}
                  <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center space-x-1 text-sm text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refresh blogs"
                  >
                    <Icon 
                      name="RefreshCw" 
                      size={14} 
                      className={refreshing ? "animate-spin" : ""} 
                    />
                    <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                  </button>
                  <Icon
                    name="SlidersHorizontal"
                    size={16}
                    className="text-slate-500"
                  />
                  <select className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white">
                    <option>Latest</option>
                    <option>Most Popular</option>
                    <option>Most Viewed</option>
                  </select>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Posts Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                {[...Array(9)].map((_, i) => (
                  <BlogCardSkeleton key={i} />
                ))}
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <Icon
                  name="BookOpen"
                  size={48}
                  className="text-slate-300 mx-auto mb-4"
                />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No blogs available
                </h3>
                <p className="text-slate-600 mb-4">
                  There are no published blogs at the moment. Check back later!
                </p>
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            ) : currentPosts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
                  {currentPosts.map((post) => (
                    <BlogCard key={post._id || post.id} post={post} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Icon
                  name="Search"
                  size={48}
                  className="text-slate-300 mx-auto mb-4"
                />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  No articles found
                </h3>
                <p className="text-slate-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
    </>
  );
};

export default Blog;

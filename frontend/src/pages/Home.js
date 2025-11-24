import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resourceAPI, announcementAPI } from '../services/api';
import { 
  FiBook, 
  FiUsers, 
  FiTrendingUp, 
  FiArrowRight,
  FiStar
} from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [stats, setStats] = useState({
    totalResources: 0,
    totalUsers: 0
  });
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const branches = [
    { code: 'CSE', name: 'Computer Science', color: 'bg-blue-500' },
    { code: 'ECE', name: 'Electronics', color: 'bg-green-500' },
    { code: 'ME', name: 'Mechanical', color: 'bg-yellow-500' },
    { code: 'EE', name: 'Electrical', color: 'bg-purple-500' },
    { code: 'CE', name: 'Civil', color: 'bg-red-500' },
    { code: 'IT', name: 'Information Tech', color: 'bg-indigo-500' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [announcementsResponse] = await Promise.all([
          announcementAPI.getAll()
        ]);
        setAnnouncements(announcementsResponse.data.announcements);

        if (isAuthenticated && user?.role === 'admin') {
          const response = await resourceAPI.getStats();
          setStats(response.data.stats);
        } else {
          const response = await resourceAPI.getApproved({ limit: 1 });
          setStats({
            totalResources: response.data.pagination?.total || 0,
            totalUsers: 0
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              College Resource Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Share knowledge, access quality resources, and collaborate with fellow students. 
              Your one-stop platform for academic excellence.
            </p>
            
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {user?.role === 'student' && (
                  <>
                    <Link
                      to="/resources"
                      className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors btn-hover inline-flex items-center justify-center"
                    >
                      <FiBook className="w-5 h-5 mr-2" />
                      Browse Resources
                    </Link>
                    <Link
                      to="/upload"
                      className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors btn-hover inline-flex items-center justify-center"
                    >
                      <FiTrendingUp className="w-5 h-5 mr-2" />
                      Upload Resource
                    </Link>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <Link
                      to="/admin?action=upload"
                      className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors btn-hover inline-flex items-center justify-center"
                    >
                      <FiTrendingUp className="w-5 h-5 mr-2" />
                      Upload Resources
                    </Link>
                    <Link
                      to="/admin?action=announcement"
                      className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors btn-hover inline-flex items-center justify-center"
                    >
                      <FiStar className="w-5 h-5 mr-2" />
                      New Announcement
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors btn-hover inline-flex items-center justify-center"
                >
                  Get Started
                  <FiArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors btn-hover inline-flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Announcements Section */}
      {isAuthenticated && announcements.length > 0 && (
        <section className="py-8 bg-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiStar className="w-5 h-5 text-blue-600 mr-2" />
                Latest Announcements
              </h2>
              <div className="space-y-3">
                {announcements.slice(0, 2).map((announcement) => (
                  <div key={announcement._id} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                    <p className="text-gray-600 text-sm">{announcement.content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiBook className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {loading ? '...' : stats.totalResources}+
              </h3>
              <p className="text-gray-600">Resources Available</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {loading ? '...' : stats.totalUsers || '500'}+
              </h3>
              <p className="text-gray-600">Active Students</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTrendingUp className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">6</h3>
              <p className="text-gray-600">Engineering Branches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Selection */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by Branch
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find resources specific to your engineering branch. 
              Quality notes and materials curated by students.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {branches.map((branch) => (
              <Link
                key={branch.code}
                to={`/resources?branch=${branch.code}`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow card-hover text-center"
              >
                <div className={`w-12 h-12 ${branch.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                  <span className="text-white font-bold text-lg">{branch.code}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{branch.code}</h3>
                <p className="text-sm text-gray-600">{branch.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students sharing and accessing quality academic resources.
            </p>
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors btn-hover inline-flex items-center"
            >
              Create Account
              <FiArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
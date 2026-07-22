import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/useAuth.js';
import { useNavigate } from 'react-router-dom';

// Base URL shared with AuthContext
const API_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ── State ──────────────────────────────────────────────────────
  const [projects, setProjects]         = useState([]);       // list of user's projects
  const [loadingProjects, setLoadingProjects] = useState(true); // initial fetch
  const [showModal, setShowModal]       = useState(false);    // create-project modal visibility
  const [creating, setCreating]         = useState(false);    // form submit loading state
  const [formData, setFormData]         = useState({ title: '', description: '' });
  const [formError, setFormError]       = useState('');
  const [fetchError, setFetchError]     = useState('');

  // ── Helper: auth header ────────────────────────────────────────
  // Every project API call needs: Authorization: Bearer <token>
  // We read the token from localStorage where login stored it
  const authHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });

  // ── Fetch projects on mount ────────────────────────────────────
  // useEffect with [] runs once when the component first appears on screen
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_URL}/projects`, authHeader());
        setProjects(res.data.data);
      } catch (err) {
        setFetchError('Failed to load projects. Please refresh.');
      } finally {
        setLoadingProjects(false);
      }
    };
    fetchProjects();
  }, []);

  // ── Logout ─────────────────────────────────────────────────────
  const handleLogout = () => {
    const result = logout();
    if (result.success) navigate('/login');
  };

  // ── Form input change ──────────────────────────────────────────
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (formError) setFormError('');
  };

  // ── Create project ─────────────────────────────────────────────
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Project title is required.');
      return;
    }
    setCreating(true);
    try {
      const res = await axios.post(
        `${API_URL}/projects`,
        { title: formData.title.trim(), description: formData.description.trim() },
        authHeader()
      );
      // Prepend the new project so it appears at the top of the list
      setProjects(prev => [res.data.data, ...prev]);
      // Reset and close modal
      setFormData({ title: '', description: '' });
      setShowModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setCreating(false);
    }
  };

  // ── Close modal (also resets form) ────────────────────────────
  const closeModal = () => {
    setShowModal(false);
    setFormData({ title: '', description: '' });
    setFormError('');
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">

      {/* ── Header ────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-indigo-700 tracking-tight">
              🚀 Team Collab
            </h1>
            {user && (
              <p className="text-sm text-gray-500 mt-0.5">
                Welcome back, <span className="font-medium text-gray-700">{user.name}</span>
              </p>
            )}
          </div>
          <button
            id="logout-btn"
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-lg transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Section title + New Project button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
            <p className="text-gray-500 text-sm mt-1">
              {projects.length === 0 ? 'No projects yet.' : `${projects.length} project${projects.length > 1 ? 's' : ''}`}
            </p>
          </div>

          {/* ── Create Project Button ─────────────────────────── */}
          <button
            id="new-project-btn"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span className="text-xl leading-none">+</span>
            New Project
          </button>
        </div>

        {/* ── Fetch error ──────────────────────────────────────── */}
        {fetchError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {fetchError}
          </div>
        )}

        {/* ── Loading state ────────────────────────────────────── */}
        {loadingProjects ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (

          /* ── Empty state ─────────────────────────────────────── */
          <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="text-5xl mb-4">📂</div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6 text-sm">Click "New Project" to create your first one.</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors duration-200"
            >
              Create Project
            </button>
          </div>

        ) : (

          /* ── Project Grid ────────────────────────────────────── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              >
                {/* Project title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                  {project.title}
                </h3>

                {/* Description (or placeholder) */}
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                  {project.description || <span className="italic text-gray-300">No description</span>}
                </p>

                {/* Footer: owner + member count */}
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 pt-3 mt-3">
                  <span>
                    Owner: <span className="font-medium text-gray-600">{project.owner?.name || 'You'}</span>
                  </span>
                  <span className="bg-indigo-50 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">
                    {project.members?.length || 1} member{project.members?.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Create Project Modal ──────────────────────────────── */}
      {showModal && (
        // Backdrop — clicking it closes the modal
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          {/* Modal card — stopPropagation prevents closing when clicking inside */}
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-1">New Project</h2>
            <p className="text-gray-500 text-sm mb-6">Fill in the details to create your project.</p>

            <form id="create-project-form" onSubmit={handleCreateProject} className="space-y-5">

              {/* Error message */}
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                  {formError}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="proj-title">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="proj-title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Website Redesign"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 transition-colors duration-200 bg-gray-50"
                  autoFocus
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" htmlFor="proj-desc">
                  Description <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  id="proj-desc"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What is this project about?"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-indigo-500 transition-colors duration-200 bg-gray-50 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  id="submit-project-btn"
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
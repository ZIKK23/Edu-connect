import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, BookOpen, Star, GraduationCap, Hash } from 'lucide-react';
import { GET_COURSES } from '../graphql/queries';
import { CREATE_COURSE, UPDATE_COURSE, DELETE_COURSE } from '../graphql/mutations';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import './Courses.css';

const Courses = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({ title: '', credits: '', lecturer: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_COURSES);
  const [createCourse, { loading: creating }] = useMutation(CREATE_COURSE);
  const [updateCourse, { loading: updating }] = useMutation(UPDATE_COURSE);
  const [deleteCourse, { loading: deleting }] = useMutation(DELETE_COURSE);

  const courses = data?.courses || [];

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        credits: course.credits.toString(),
        lecturer: course.lecturer,
      });
    } else {
      setEditingCourse(null);
      setFormData({ title: '', credits: '', lecturer: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormData({ title: '', credits: '', lecturer: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.credits || !formData.lecturer.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const credits = parseInt(formData.credits);
    if (isNaN(credits) || credits <= 0) {
      toast.error('Credits must be a positive number');
      return;
    }

    try {
      const input = {
        title: formData.title,
        credits: credits,
        lecturer: formData.lecturer,
      };

      if (editingCourse) {
        await updateCourse({
          variables: { id: editingCourse.id, input },
        });
        toast.success('Course updated successfully!');
      } else {
        await createCourse({
          variables: { input },
        });
        toast.success('Course created successfully!');
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  const handleDelete = (id, title) => {
    setConfirmDelete({ id, title });
  };

  const confirmDeleteAction = async () => {
    try {
      await deleteCourse({ variables: { id: confirmDelete.id } });
      toast.success('Course deleted successfully!');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to delete course');
    } finally {
      setConfirmDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message card">
          <p>Error loading courses: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="courses-page">
      <div className="container">
        <div className="page-header flex-between">
          <div>
            <h1>Courses Management</h1>
            <p className="text-muted">Manage all course offerings</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" /> Add Course
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="card text-center">
            <p className="text-muted">No courses found. Add your first course!</p>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card card">
                <BookOpen className="course-icon-svg" size={48} />
                <h3 className="course-title">{course.title}</h3>
                <div className="course-details">
                  <div className="course-detail-item">
                    <Star className="detail-icon-svg" size={18} />
                    <span className="detail-text">{course.credits} Credits</span>
                  </div>
                  <div className="course-detail-item">
                    <GraduationCap className="detail-icon-svg" size={18} />
                    <span className="detail-text">{course.lecturer}</span>
                  </div>
                  <div className="course-detail-item">
                    <Hash className="detail-icon-svg" size={18} />
                    <span className="detail-text text-muted">ID: {course.id}</span>
                  </div>
                </div>
                <div className="course-actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleOpenModal(course)}
                    disabled={updating}
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(course.id, course.title)}
                    disabled={deleting}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Create/Edit */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingCourse ? 'Edit Course' : 'Add New Course'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Course Title</label>
              <input
                type="text"
                className="input"
                placeholder="e.g., Web Development"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Credits</label>
              <input
                type="number"
                className="input"
                placeholder="e.g., 3"
                min="1"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lecturer</label>
              <input
                type="text"
                className="input"
                placeholder="e.g., Dr. John Doe"
                value={formData.lecturer}
                onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })}
                required
              />
            </div>

            <div className="modal-buttons flex gap-md">
              <button
                type="button"
                className="btn btn-secondary flex-1"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={creating || updating}
              >
                {creating || updating ? 'Saving...' : editingCourse ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={confirmDeleteAction}
          title="Delete Course"
          message={`Are you sure you want to delete "${confirmDelete?.title}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default Courses;

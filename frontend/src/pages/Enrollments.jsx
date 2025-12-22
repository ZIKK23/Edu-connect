import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import { GET_ENROLLMENTS, GET_STUDENTS, GET_COURSES } from '../graphql/queries';
import {
  CREATE_ENROLLMENT,
  UPDATE_ENROLLMENT,
  DELETE_ENROLLMENT,
} from '../graphql/mutations';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import './Enrollments.css';

const Enrollments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [formData, setFormData] = useState({ studentId: '', courseId: '', grade: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data: enrollmentsData, loading, error, refetch } = useQuery(GET_ENROLLMENTS);
  const { data: studentsData } = useQuery(GET_STUDENTS);
  const { data: coursesData } = useQuery(GET_COURSES);
  
  const [createEnrollment, { loading: creating }] = useMutation(CREATE_ENROLLMENT);
  const [updateEnrollment, { loading: updating }] = useMutation(UPDATE_ENROLLMENT);
  const [deleteEnrollment, { loading: deleting }] = useMutation(DELETE_ENROLLMENT);

  const enrollments = enrollmentsData?.enrollments || [];
  const students = studentsData?.students || [];
  const courses = coursesData?.courses || [];

  const handleOpenModal = (enrollment = null) => {
    if (enrollment) {
      setEditingEnrollment(enrollment);
      setFormData({
        studentId: enrollment.student.id,
        courseId: enrollment.course.id,
        grade: enrollment.grade || '',
      });
    } else {
      setEditingEnrollment(null);
      setFormData({ studentId: '', courseId: '', grade: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEnrollment(null);
    setFormData({ studentId: '', courseId: '', grade: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.studentId || !formData.courseId) {
      toast.error('Please select both student and course');
      return;
    }

    try {
      if (editingEnrollment) {
        // Only update grade
        await updateEnrollment({
          variables: {
            id: editingEnrollment.id,
            input: { grade: formData.grade || null },
          },
        });
        toast.success('Enrollment updated successfully!');
      } else {
        await createEnrollment({
          variables: {
            input: {
              studentId: formData.studentId,
              courseId: formData.courseId,
              grade: formData.grade || null,
            },
          },
        });
        toast.success('Enrollment created successfully!');
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  const handleDelete = (id, studentName, courseTitle) => {
    setConfirmDelete({ id, studentName, courseTitle });
  };

  const confirmDeleteAction = async () => {
    try {
      await deleteEnrollment({ variables: { id: confirmDelete.id } });
      toast.success('Enrollment deleted successfully!');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to delete enrollment');
    } finally {
      setConfirmDelete(null);
    }
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'badge-primary';
    const g = grade.toUpperCase();
    if (g.startsWith('A')) return 'badge-success';
    if (g.startsWith('B')) return 'badge-primary';
    if (g.startsWith('C')) return 'badge-warning';
    return 'badge-danger';
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
          <p>Error loading enrollments: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="enrollments-page">
      <div className="container">
        <div className="page-header flex-between">
          <div>
            <h1>Enrollments Management</h1>
            <p className="text-muted">Manage student course enrollments</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" /> Add Enrollment
          </button>
        </div>

        {enrollments.length === 0 ? (
          <div className="card text-center">
            <p className="text-muted">No enrollments found. Add your first enrollment!</p>
          </div>
        ) : (
          <div className="enrollments-list">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="enrollment-card card">
                <div className="enrollment-main">
                  <div className="enrollment-student-info">
                    <div className="student-avatar-small">
                      {enrollment.student.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="enrollment-student-name">
                        {enrollment.student.name}
                      </div>
                      <div className="enrollment-student-email text-muted">
                        {enrollment.student.email}
                      </div>
                    </div>
                  </div>

                  <div className="enrollment-course-info">
                    <BookOpen className="course-icon-svg-small" size={28} />
                    <div>
                      <div className="enrollment-course-title">
                        {enrollment.course.title}
                      </div>
                      <div className="enrollment-course-credits text-muted">
                        {enrollment.course.credits} Credits
                      </div>
                    </div>
                  </div>

                  {enrollment.grade && (
                    <div className={`enrollment-grade badge ${getGradeColor(enrollment.grade)}`}>
                      Grade: {enrollment.grade}
                    </div>
                  )}
                </div>

                <div className="enrollment-actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleOpenModal(enrollment)}
                    disabled={updating}
                  >
                    <Pencil className="w-4 h-4" /> Edit Grade
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() =>
                      handleDelete(
                        enrollment.id,
                        enrollment.student.name,
                        enrollment.course.title
                      )
                    }
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
          title={editingEnrollment ? 'Edit Enrollment Grade' : 'Create New Enrollment'}
        >
          <form onSubmit={handleSubmit}>
            {!editingEnrollment && (
              <>
                <div className="form-group">
                  <label className="form-label">Student</label>
                  <select
                    className="input"
                    value={formData.studentId}
                    onChange={(e) =>
                      setFormData({ ...formData, studentId: e.target.value })
                    }
                    required
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name} ({student.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Course</label>
                  <select
                    className="input"
                    value={formData.courseId}
                    onChange={(e) =>
                      setFormData({ ...formData, courseId: e.target.value })
                    }
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title} ({course.credits} credits)
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {editingEnrollment && (
              <div className="enrollment-edit-info card">
                <p>
                  <strong>Student:</strong> {editingEnrollment.student.name}
                </p>
                <p>
                  <strong>Course:</strong> {editingEnrollment.course.title}
                </p>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Grade (Optional)</label>
              <input
                type="text"
                className="input"
                placeholder="e.g., A, B+, A-"
                value={formData.grade}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
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
                {creating || updating
                  ? 'Saving...'
                  : editingEnrollment
                  ? 'Update Grade'
                  : 'Create'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={confirmDeleteAction}
          title="Delete Enrollment"
          message={`Are you sure you want to delete enrollment for "${confirmDelete?.studentName}" in "${confirmDelete?.courseTitle}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default Enrollments;

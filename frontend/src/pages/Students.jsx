import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { GET_STUDENTS } from '../graphql/queries';
import { CREATE_STUDENT, UPDATE_STUDENT, DELETE_STUDENT } from '../graphql/mutations';
import Modal from '../components/Modal';
import ConfirmModal from '../components/ConfirmModal';
import './Students.css';

const Students = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, loading, error, refetch } = useQuery(GET_STUDENTS);
  const [createStudent, { loading: creating }] = useMutation(CREATE_STUDENT);
  const [updateStudent, { loading: updating }] = useMutation(UPDATE_STUDENT);
  const [deleteStudent, { loading: deleting }] = useMutation(DELETE_STUDENT);

  const students = data?.students || [];

  const handleOpenModal = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({ name: student.name, email: student.email });
    } else {
      setEditingStudent(null);
      setFormData({ name: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({ name: '', email: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingStudent) {
        await updateStudent({
          variables: { id: editingStudent.id, input: formData },
        });
        toast.success('Student updated successfully!');
      } else {
        await createStudent({
          variables: { input: formData },
        });
        toast.success('Student created successfully!');
      }
      refetch();
      handleCloseModal();
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    }
  };

  const handleDelete = (id, name) => {
    setConfirmDelete({ id, name });
  };

  const confirmDeleteAction = async () => {
    try {
      await deleteStudent({ variables: { id: confirmDelete.id } });
      toast.success('Student deleted successfully!');
      refetch();
    } catch (err) {
      toast.error(err.message || 'Failed to delete student');
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
          <p>Error loading students: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="students-page">
      <div className="container">
        <div className="page-header flex-between">
          <div>
            <h1>Students Management</h1>
            <p className="text-muted">Manage all student records</p>
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>

        {students.length === 0 ? (
          <div className="card text-center">
            <p className="text-muted">No students found. Add your first student!</p>
          </div>
        ) : (
          <div className="students-grid">
            {students.map((student) => (
              <div key={student.id} className="student-card card">
                <div className="student-avatar">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <div className="student-info">
                  <h3>{student.name}</h3>
                  <p className="student-email">{student.email}</p>
                  <p className="student-id text-muted">ID: {student.id}</p>
                </div>
                <div className="student-actions">
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => handleOpenModal(student)}
                    disabled={updating}
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(student.id, student.name)}
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
          title={editingStudent ? 'Edit Student' : 'Add New Student'}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="input"
                placeholder="Enter student name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                {creating || updating ? 'Saving...' : editingStudent ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </Modal>

        {/* Confirm Delete Modal */}
        <ConfirmModal
          isOpen={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          onConfirm={confirmDeleteAction}
          title="Delete Student"
          message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
};

export default Students;

import { useQuery } from '@apollo/client';
import { GET_STUDENTS, GET_COURSES, GET_ENROLLMENTS } from '../graphql/queries';
import { Users, BookOpen, GraduationCap, TrendingUp, Clock } from 'lucide-react';

const Dashboard = () => {
  const { data: studentsData, loading: studentsLoading } = useQuery(GET_STUDENTS);
  const { data: coursesData, loading: coursesLoading } = useQuery(GET_COURSES);
  const { data: enrollmentsData, loading: enrollmentsLoading } = useQuery(GET_ENROLLMENTS);

  const students = studentsData?.students || [];
  const courses = coursesData?.courses || [];
  const enrollments = enrollmentsData?.enrollments || [];

  const isLoading = studentsLoading || coursesLoading || enrollmentsLoading;

  // Get recent enrollments (last 5)
  const recentEnrollments = [...enrollments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const stats = [
    {
      label: 'Total Students',
      value: students.length,
      icon: Users,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      label: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      label: 'Total Enrollments',
      value: enrollments.length,
      icon: GraduationCap,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
    {
      label: 'Avg Enrollments',
      value: students.length > 0 ? (enrollments.length / students.length).toFixed(1) : '0',
      icon: TrendingUp,
      color: '#10b981',
      bgColor: '#d1fae5',
    },
  ];

  const getGradeColor = (grade) => {
    if (!grade) return { bg: '#f3f4f6', text: '#6b7280' };
    const g = grade.toUpperCase();
    if (g.startsWith('A')) return { bg: '#d1fae5', text: '#065f46' };
    if (g.startsWith('B')) return { bg: '#a7f3d0', text: '#047857' };
    if (g.startsWith('C')) return { bg: '#fef3c7', text: '#92400e' };
    return { bg: '#fee2e2', text: '#991b1b' };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div 
            className="w-12 h-12 border-4 rounded-full animate-spin"
            style={{ 
              borderColor: '#d1fae5',
              borderTopColor: 'var(--color-primary)'
            }}
          ></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Welcome to EduConnect - Your modern education management platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="relative group rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: stat.bgColor }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              
              <div>
                <div className="text-3xl font-bold mb-1" style={{ color: stat.color }}>
                  {isLoading ? '...' : stat.value}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Enrollments */}
      <div 
        className="rounded-2xl p-6 shadow-sm"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--color-primary)' }}
          >
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Recent Enrollments
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Latest student course registrations
            </p>
          </div>
        </div>

        {recentEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <GraduationCap className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>No enrollments yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Enrollments will appear here once students register for courses
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentEnrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="flex items-center justify-between p-4 rounded-xl transition-all duration-200"
                style={{ background: 'var(--bg-secondary)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderLeft = '3px solid var(--color-primary)';
                  e.currentTarget.style.paddingLeft = '13px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderLeft = 'none';
                  e.currentTarget.style.paddingLeft = '16px';
                }}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Student Avatar */}
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg shrink-0"
                    style={{ background: 'var(--color-primary)' }}
                  >
                    {enrollment.student.name.charAt(0).toUpperCase()}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
                      {enrollment.student.name}
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      <BookOpen className="w-4 h-4" />
                      <span className="truncate">{enrollment.course.title}</span>
                    </div>
                  </div>
                </div>

                {/* Grade Badge */}
                {enrollment.grade && (
                  <div 
                    className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                    style={{
                      background: getGradeColor(enrollment.grade).bg,
                      color: getGradeColor(enrollment.grade).text
                    }}
                  >
                    {enrollment.grade}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Courses Grid */}
      <div 
        className="rounded-2xl p-6 shadow-sm"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)'
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--color-primary)' }}
          >
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Available Courses
            </h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Browse all courses in the system
            </p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'var(--bg-secondary)' }}
            >
              <BookOpen className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>No courses available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => {
              const enrollmentCount = enrollments.filter(e => e.course.id === course.id).length;
              return (
                <div
                  key={course.id}
                  className="p-4 rounded-xl transition-all duration-200 border"
                  style={{
                    background: 'var(--bg-secondary)',
                    borderColor: 'var(--border-color)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 
                      className="font-semibold transition-colors"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {course.title}
                    </h3>
                    <span 
                      className="px-2 py-1 text-xs font-medium rounded-md"
                      style={{ 
                        background: '#d1fae5',
                        color: '#065f46'
                      }}
                    >
                      {course.credits} Credits
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <Users className="w-4 h-4" />
                      <span>{course.lecturer}</span>
                    </div>
                    <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <GraduationCap className="w-4 h-4" />
                      <span>{enrollmentCount} students enrolled</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

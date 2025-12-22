import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    ClipboardList,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const menuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/students', icon: Users, label: 'Students' },
        { path: '/courses', icon: BookOpen, label: 'Courses' },
        { path: '/enrollments', icon: ClipboardList, label: 'Enrollments' },
    ];

    return (
        <aside 
            style={{
                background: 'var(--sidebar-bg)',
                borderRight: `1px solid var(--sidebar-border)`
            }}
            className={`
                fixed left-0 top-0 h-screen
                ${isCollapsed ? 'w-20' : 'w-72'}
                flex flex-col
                transition-all duration-300 ease-in-out
                z-50
                shadow-sm
            `}
        >
            {/* Header - Konsisten horizontal layout */}
            <div 
                className="h-20 px-4 flex items-center justify-between"
                style={{ borderBottom: `1px solid var(--sidebar-border)` }}
            >
                {/* Logo - ukuran sama saat collapsed/expanded */}
                <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0"
                    style={{ background: 'var(--color-primary)' }}
                >
                    <BookOpen className="w-5 h-5 text-white" />
                </div>

                {/* Text - hanya muncul saat expanded */}
                {!isCollapsed && (
                    <div className="flex-1 ml-3 mr-2">
                        <div className="text-base font-bold" style={{ color: 'var(--sidebar-text)' }}>
                            EduConnect
                        </div>
                        <div className="text-xs" style={{ color: 'var(--sidebar-text-secondary)' }}>
                            Education Platform
                        </div>
                    </div>
                )}
                
                {/* Toggle button - selalu di kanan */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={`rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 shrink-0 ${isCollapsed ? 'w-8 h-8' : 'w-8 h-8'}`}
                    style={{
                        background: 'var(--sidebar-hover)',
                        color: 'var(--sidebar-text-secondary)'
                    }}
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className={`flex-1 overflow-y-auto ${isCollapsed ? 'px-2 py-4' : 'px-3 py-6'}`}>
                <div className={isCollapsed ? 'space-y-2' : 'space-y-1'}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    group relative flex items-center rounded-xl
                                    transition-all duration-200
                                    ${isCollapsed ? 'justify-center w-full h-12' : 'gap-3 px-3 py-3'}
                                `}
                                style={active ? {
                                    background: 'var(--color-primary)',
                                    color: 'white'
                                } : {
                                    color: 'var(--sidebar-text-secondary)'
                                }}
                                onMouseEnter={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.background = 'var(--sidebar-hover)';
                                        e.currentTarget.style.color = 'var(--color-primary)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!active) {
                                        e.currentTarget.style.background = '';
                                        e.currentTarget.style.color = 'var(--sidebar-text-secondary)';
                                    }
                                }}
                                title={isCollapsed ? item.label : ''}
                            >
                                {/* Active indicator */}
                                {active && !isCollapsed && (
                                    <div 
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full" 
                                        style={{ background: 'white' }}
                                    />
                                )}
                                
                                <Icon 
                                    size={20} 
                                    className={`shrink-0 ${active ? '' : 'group-hover:scale-110'} transition-transform duration-200`} 
                                />
                                
                                {!isCollapsed && (
                                    <span className="font-medium text-sm">
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Footer */}
            <div 
                className="p-4"
                style={{ borderTop: `1px solid var(--sidebar-border)` }}
            >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    <ThemeToggle collapsed={isCollapsed} />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

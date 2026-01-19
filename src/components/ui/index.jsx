/**
 * PENDO UI Components
 * Premium reusable components for the PENDO financial platform
 */

import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

// ========================================
// BUTTON COMPONENT
// ========================================
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  const baseStyles = `
    relative inline-flex items-center justify-center gap-2
    font-medium rounded-xl
    transition-all duration-300 ease-out
    disabled:opacity-50 disabled:cursor-not-allowed
    overflow-hidden
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-500 to-blue-600
      hover:from-blue-400 hover:to-blue-500
      text-white shadow-lg shadow-blue-500/25
      hover:shadow-blue-500/40 hover:-translate-y-0.5
    `,
    secondary: `
      bg-gradient-to-r from-emerald-500 to-emerald-600
      hover:from-emerald-400 hover:to-emerald-500
      text-white shadow-lg shadow-emerald-500/25
      hover:shadow-emerald-500/40 hover:-translate-y-0.5
    `,
    accent: `
      bg-gradient-to-r from-amber-500 to-amber-600
      hover:from-amber-400 hover:to-amber-500
      text-gray-900 shadow-lg shadow-amber-500/25
      hover:shadow-amber-500/40 hover:-translate-y-0.5
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600
      hover:from-red-400 hover:to-red-500
      text-white shadow-lg shadow-red-500/25
      hover:shadow-red-500/40 hover:-translate-y-0.5
    `,
    ghost: `
      bg-transparent hover:bg-white/10
      text-white/70 hover:text-white
      border border-white/10 hover:border-white/20
    `,
    outline: `
      bg-transparent hover:bg-blue-500
      text-blue-400 hover:text-white
      border-2 border-blue-400 hover:border-blue-500
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shimmer effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />

      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />
      )}
      <span className="relative z-10">{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  );
};

// ========================================
// CARD COMPONENT
// ========================================
export const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = true,
  glow = false,
  className = '',
  ...props
}) => {
  const baseStyles = `
    relative overflow-hidden rounded-2xl
    bg-gradient-to-br from-[#1a2744]/90 to-[#0f172a]/90
    border border-white/10
    backdrop-blur-xl
    transition-all duration-300
  `;

  const hoverStyles = hover ? `
    hover:border-white/20
    hover:shadow-2xl hover:shadow-blue-500/10
    hover:-translate-y-1
  ` : '';

  const glowStyles = glow ? `
    before:absolute before:inset-0 before:rounded-2xl
    before:bg-gradient-to-br before:from-blue-500/20 before:via-transparent before:to-emerald-500/20
    before:opacity-0 hover:before:opacity-100 before:transition-opacity
  ` : '';

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${glowStyles} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// ========================================
// INPUT COMPONENT
// ========================================
export const Input = ({
  label,
  error,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-white/70">{label}</label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-blue-400 transition-colors" />
        )}
        <input
          className={`
            w-full py-3 bg-white/5 border rounded-xl
            text-white placeholder-white/30
            focus:outline-none focus:bg-white/10
            transition-all duration-200
            ${Icon ? 'pl-11 pr-4' : 'px-4'}
            ${error
              ? 'border-red-500/50 focus:border-red-500'
              : 'border-white/10 focus:border-blue-500/50'
            }
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-400 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
    </div>
  );
};

// ========================================
// BADGE COMPONENT
// ========================================
export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variants = {
    default: 'bg-white/10 text-white/70 border-white/10',
    primary: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    danger: 'bg-red-500/20 text-red-400 border-red-500/30',
    info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const dotColors = {
    default: 'bg-white/50',
    primary: 'bg-blue-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-red-400',
    info: 'bg-cyan-400',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-medium rounded-full border
        ${variants[variant]} ${sizes[size]} ${className}
      `}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} ${variant === 'success' || variant === 'primary' ? 'animate-pulse' : ''}`} />
      )}
      {children}
    </span>
  );
};

// ========================================
// ALERT COMPONENT
// ========================================
export const Alert = ({
  children,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const variants = {
    info: {
      bg: 'bg-blue-500/10 border-blue-500/30',
      icon: Info,
      iconColor: 'text-blue-400',
    },
    success: {
      bg: 'bg-emerald-500/10 border-emerald-500/30',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
    },
    warning: {
      bg: 'bg-amber-500/10 border-amber-500/30',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    danger: {
      bg: 'bg-red-500/10 border-red-500/30',
      icon: AlertCircle,
      iconColor: 'text-red-400',
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border
        ${config.bg} ${className}
      `}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1">
        {title && (
          <h4 className="font-medium text-white mb-1">{title}</h4>
        )}
        <div className="text-sm text-white/70">{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-white/50" />
        </button>
      )}
    </div>
  );
};

// ========================================
// SKELETON LOADER
// ========================================
export const Skeleton = ({
  width,
  height = '1rem',
  rounded = 'md',
  className = '',
}) => {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <div
      className={`
        bg-gradient-to-r from-white/5 via-white/10 to-white/5
        bg-[length:200%_100%] animate-shimmer
        ${roundedClasses[rounded]} ${className}
      `}
      style={{ width, height }}
    />
  );
};

// ========================================
// STAT CARD COMPONENT
// ========================================
export const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  trend,
  className = '',
}) => {
  const changeColors = {
    positive: 'text-emerald-400 bg-emerald-500/20',
    negative: 'text-red-400 bg-red-500/20',
    neutral: 'text-white/60 bg-white/10',
  };

  return (
    <Card padding="md" className={className}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/50 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <span className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-lg text-sm font-medium ${changeColors[changeType]}`}>
              {change}
            </span>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-blue-500/20 rounded-xl">
            <Icon className="w-6 h-6 text-blue-400" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${changeType === 'positive' ? 'bg-emerald-500' : changeType === 'negative' ? 'bg-red-500' : 'bg-blue-500'}`}
            style={{ width: `${Math.min(Math.abs(parseFloat(trend)), 100)}%` }}
          />
        </div>
      )}
    </Card>
  );
};

// ========================================
// PROGRESS BAR
// ========================================
export const Progress = ({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className = '',
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-400',
    secondary: 'bg-gradient-to-r from-emerald-500 to-emerald-400',
    accent: 'bg-gradient-to-r from-amber-500 to-amber-400',
    danger: 'bg-gradient-to-r from-red-500 to-red-400',
  };

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between text-sm text-white/60 mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`bg-white/10 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${sizes[size]} rounded-full transition-all duration-500 ${variants[variant]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ========================================
// AVATAR COMPONENT
// ========================================
export const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  status,
  className = '',
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusColors = {
    online: 'bg-emerald-400',
    offline: 'bg-gray-400',
    busy: 'bg-red-400',
    away: 'bg-amber-400',
  };

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={`rounded-full object-cover ${sizes[size]}`}
        />
      ) : (
        <div className={`
          flex items-center justify-center rounded-full
          bg-gradient-to-br from-blue-500 to-purple-500
          text-white font-medium
          ${sizes[size]}
        `}>
          {initials}
        </div>
      )}
      {status && (
        <span className={`
          absolute bottom-0 right-0 w-3 h-3
          rounded-full border-2 border-[#0f172a]
          ${statusColors[status]}
        `} />
      )}
    </div>
  );
};

// ========================================
// DIVIDER COMPONENT
// ========================================
export const Divider = ({
  orientation = 'horizontal',
  label,
  className = '',
}) => {
  if (orientation === 'vertical') {
    return (
      <div className={`w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent ${className}`} />
    );
  }

  if (label) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-sm text-white/40">{label}</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    );
  }

  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-white/10 to-transparent ${className}`} />
  );
};

// ========================================
// TOOLTIP WRAPPER
// ========================================
export const Tooltip = ({
  children,
  content,
  position = 'top',
}) => {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div className={`
        absolute ${positions[position]}
        px-3 py-1.5 rounded-lg
        bg-gray-800 text-white text-sm
        border border-white/10
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        transition-all duration-200
        whitespace-nowrap z-50
      `}>
        {content}
      </div>
    </div>
  );
};

export default {
  Button,
  Card,
  Input,
  Badge,
  Alert,
  Skeleton,
  StatCard,
  Progress,
  Avatar,
  Divider,
  Tooltip,
};

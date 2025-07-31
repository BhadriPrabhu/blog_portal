const PostCard = ({ date, author, title, content, likes, comments, onClick, onDelete, onArchive, onTag, onRemoveSpam }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      style={{
        backgroundColor: '#fff0f0',
        padding: '20px',
        borderRadius: '16px',
        boxShadow: isHovered ? '0 12px 40px rgba(0, 0, 0, 0.15)' : '0 4px 20px rgba(0, 0, 0, 0.08)',
        width: '100%', // Grid will handle width, but 100% ensures full column use
        maxWidth: '380px', // Maintains max width constraint
        fontFamily: "'Poppins', sans-serif",
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        border: '1px solid #f5e9e9',
        background: 'linear-gradient(135deg, #f5e9e9 0%, #ffebee 100%)',
        minHeight: '0', // Allows natural height based on content
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Rest of the existing content remains unchanged */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <span style={{ 
          color: '#4a2c2c', 
          fontSize: '12px', 
          backgroundColor: '#f5e9e9', 
          padding: '4px 8px', 
          borderRadius: '6px',
          fontWeight: '500'
        }}>{date}</span>
        <span style={{ 
          color: '#e0c7c7', 
          fontSize: '13px', 
          fontWeight: '600',
          backgroundColor: '#e0c7c7',
          padding: '4px 8px',
          borderRadius: '6px'
        }}>{author}</span>
      </div>
      
      <h3 style={{ 
        margin: '0 0 12px 0', 
        fontSize: '18px', 
        fontWeight: '700',
        color: '#4a2c2c',
        lineHeight: '1.4'
      }}>{title}</h3>
      
      <p style={{ 
        margin: '0 0 16px 0', 
        fontSize: '14px',
        color: '#4a2c2c',
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>{content}</p>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '12px',
        backgroundColor: '#f5e9e9',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <BarChart3 size={16} color="#e0c7c7" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#e0c7c7' }}>{likes} likes</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Users size={16} color="#e0c7c7" />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#e0c7c7' }}>{comments} comments</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          style={{
            flex: 1,
            minWidth: '70px',
            height: '36px',
            backgroundColor: '#e0c7c7',
            border: 'none',
            borderRadius: '6px',
            color: '#4a2c2c',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
        >
          <Trash2 size={14} />
          Delete
        </button>
        <button
          style={{
            flex: 1,
            minWidth: '70px',
            height: '36px',
            backgroundColor: '#e0c7c7',
            border: 'none',
            borderRadius: '6px',
            color: '#4a2c2c',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          onClick={(e) => { e.stopPropagation(); onArchive(); }}
        >
          <Archive size={14} />
          Archive
        </button>
        <button
          style={{
            flex: 1,
            minWidth: '70px',
            height: '36px',
            backgroundColor: '#e0c7c7',
            border: 'none',
            borderRadius: '6px',
            color: '#4a2c2c',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          onClick={(e) => { e.stopPropagation(); onTag(); }}
        >
          <Tag size={14} />
          Tag
        </button>
        <button
          style={{
            flex: 1,
            minWidth: '70px',
            height: '36px',
            backgroundColor: '#e0c7c7',
            border: 'none',
            borderRadius: '6px',
            color: '#4a2c2c',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px'
          }}
          onClick={(e) => { e.stopPropagation(); onRemoveSpam(); }}
        >
          <Shield size={14} />
          Spam
        </button>
      </div>
    </div>
  );
};

export default PostCard;
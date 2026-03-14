import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, MapPin, Type, Link as LinkIcon, X, Globe } from "lucide-react";
import ButtonTrans from "./buttonTran";
import ReactDOM from "react-dom";
import Button from "./button";

const EditProfileModal = ({ isOpen, onClose, data, setData, onSave, isSaving }) => {

    const [hover1, setHover1] = React.useState(false);

    const avatarInputRef = React.useRef(null);
    const coverInputRef = React.useRef(null);

    if (!isOpen) return null;

    const saveBtnStyle = {
        padding: '10px 20px',
        borderRadius: '12px',
        border: 'none',
        backgroundColor: '#3b82f6',
        color: 'white',
        fontWeight: '600',
        fontSize: '14px',
        transition: 'all 0.2s ease'
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files?.[0];
        if (file) {
            const localPreview = URL.createObjectURL(file);
            setData({
                ...data,
                [field]: localPreview,
                [`${field}File`]: file
            });
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };


    return ReactDOM.createPortal(
        <AnimatePresence>
            <div style={{
                position: 'fixed', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10000, padding: '10px', backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)'
            }}
                onClick={handleOverlayClick}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    style={{
                        backgroundColor: 'white', borderRadius: '24px',
                        width: '100%', maxWidth: '500px',
                        display: 'flex', flexDirection: 'column',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                        overflow: 'hidden', maxHeight: '90vh', scrollbarWidth: 'none'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '20px', borderBottom: '1px solid #f1f5f9',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#1e293b' }}>Edit Profile</h2>
                        <ButtonTrans
                            buttonType="button"
                            ClickEvent={() => {
                                onClose()
                                setHover1(false);
                            }}
                            label="Close"
                            child={<>
                                <X size={20} />
                            </>}
                            noToolTip={true}
                            paddingEdit="2px 2px"
                            hover={hover1}
                            mouseEnter={() => setHover1(true)}
                            mouseLeave={() => setHover1(false)}
                        />
                    </div>

                    <div className="custom-scrollbar" style={{ padding: '0 15px 20px 20px', overflowY: 'auto' }}>
                        {/* Visual Preview Section */}
                        <div style={{ position: 'relative', marginBottom: '54px', marginTop: '20px' }}>
                            {/* Cover Preview */}
                            <div style={{
                                height: '120px', borderRadius: '12px', position: 'relative',
                                display: 'flex', justifyContent: 'flex-end', padding: '12px',
                                background: data.coverImage ? `url(${data.coverImage}) center/cover` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}>
                                <button style={{
                                    width: '32px', height: '32px', borderRadius: '50%', border: 'none',
                                    backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
                                }} title="Change Cover"
                                    onClick={() => coverInputRef.current.click()}
                                >
                                    <Camera size={16} />
                                </button>
                                <input
                                    type="file"
                                    ref={coverInputRef}
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleFileChange(e, 'coverImage')}
                                    accept="image/*"
                                />
                            </div>

                            {/* Avatar Preview */}
                            <div style={{
                                position: 'absolute', bottom: '-40px', left: '20px',
                                padding: '4px', backgroundColor: 'white', borderRadius: '50%'
                            }}>
                                <div style={{
                                    width: '80px', height: '80px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative', overflow: 'hidden',
                                    backgroundColor: '#3498DB',
                                    backgroundImage: data.avatar ? `url(${data.avatar})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat'
                                }}>
                                    {!data.avatar && <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>{data.user?.[0] || 'U'}</span>}
                                    <div style={{
                                        position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                                    }}
                                        onClick={() => avatarInputRef.current.click()}
                                    >
                                        <Camera size={18} color="white" />
                                    </div>
                                    <input
                                        type="file"
                                        ref={avatarInputRef}
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleFileChange(e, 'avatar')}
                                        accept="image/*"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Display Name */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Type size={14} /> Display Name
                                </label>
                                <input
                                    style={{
                                        padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                        fontFamily: 'Poppins', fontSize: '14px', outline: 'none',
                                        backgroundColor: '#f8fafc'
                                    }}
                                    value={data.user}
                                    placeholder="What's your name?"
                                    onChange={(e) => setData({ ...data, user: e.target.value })}
                                />
                            </div>

                            {/* Bio */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
                                <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <LinkIcon size={14} /> Bio
                                </label>
                                <textarea
                                    style={{
                                        padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                        fontFamily: 'Poppins', fontSize: '14px', outline: 'none',
                                        backgroundColor: '#f8fafc', height: '90px', resize: 'none'
                                    }}
                                    value={data.bio}
                                    placeholder="Tell us about yourself..."
                                    onChange={(e) => setData({ ...data, bio: e.target.value })}
                                />
                                <span style={{ position: 'absolute', bottom: '-18px', right: '4px', fontSize: '11px', color: '#94a3b8' }}>
                                    {data.bio?.length || 0}/160
                                </span>
                            </div>

                            {/* Location & Website Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={14} /> Location
                                    </label>
                                    <input
                                        style={{
                                            padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0',
                                            fontFamily: 'Poppins', fontSize: '13px', outline: 'none',
                                            backgroundColor: '#f8fafc'
                                        }}
                                        value={data.location}
                                        placeholder="City, Country"
                                        onChange={(e) => setData({ ...data, location: e.target.value })}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Globe size={14} /> Website
                                    </label>
                                    <input
                                        style={{
                                            padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0',
                                            fontFamily: 'Poppins', fontSize: '13px', outline: 'none',
                                            backgroundColor: '#f8fafc'
                                        }}
                                        value={data.website}
                                        placeholder="https://..."
                                        onChange={(e) => setData({ ...data, website: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                        padding: '16px 24px', backgroundColor: '#f8fafc',
                        display: 'flex', justifyContent: 'flex-end', gap: '12px',
                        borderTop: '1px solid #f1f5f9'
                    }}>
                        <Button
                            normalField={true}
                            onClick={onClose}
                            value="Cancel"
                        />
                        <Button
                            onClick={onSave}
                            disabled={isSaving}
                            value={isSaving ? "Uploading..." : "Save Changes"}
                        />
                    </div>
                </motion.div>
                <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #61a0ed; 
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #3987e7;
                }
            `}</style>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default EditProfileModal;
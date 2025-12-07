import React, { useState, useEffect, useCallback } from 'react';

import LogoGrill from './assets/logo.svg'; 
import GratarSvg from './assets/Gratare.svg'; 
import LouisSvg from './assets/Louis.svg'; 

const API_BASE_URL = 'http://localhost:3001/api';

const fetchApi = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(API_BASE_URL + url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Eroare la API');
  }

  return data;
};

const SimpleModal = ({ title, children, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h3 className="modal-title">{title}</h3>
        <button onClick={onClose} className="modal-close-btn">X</button>
      </div>
      {children}
    </div>
  </div>
);

const GrillCard = ({ grill, user, onLike, onDelete, onEdit }) => {
  const isOwner = user && user._id === grill.creator_id;
  const isAdmin = user && user.role === 'admin';

  const handleLike = () => {
    if (user) {
      onLike(grill._id);
    } else {
      alert('Loghează-te pentru a da un MIC!');
    }
  };

  return (
    <div className="grill-card">
      <div className="grill-image-placeholder">[Poza Grătar Aici]</div>
      <h4 className="grill-title">{grill.name}</h4>
      <p className="grill-meta">Creator ID: {grill.creator_id || 'N/A'}</p>
      <p className="grill-description">{grill.description}</p>
      
      <div className="grill-actions">
        <button 
          onClick={handleLike} 
          className={grill.isLiked ? 'like-btn liked' : 'like-btn'}
        >
          {grill.mics_count} MICI {grill.isLiked ? '❤️' : '🤍'}
        </button>
        
        {(isOwner || isAdmin) && (
            <div className="admin-actions">
                {(isOwner && !isAdmin) && ( 
                    <button onClick={() => onEdit(grill)} className="edit-btn" title="Editează">Edit</button>
                )}
                <button onClick={() => onDelete(grill._id)} className="delete-btn" title="Șterge">Șterge</button>
            </div>
        )}
      </div>
    </div>
  );
};

const StaticHomePage = ({ setCurrentPage }) => {
    
    return (
      <div className="homepage-container">
          
          <div className="homepage-hero">
              
              <div className="hero-background">
                  <img src={GratarSvg} alt="Grill Background" className="hero-bg-img" />
              </div>
              
              <div className="hero-content">
                  <h1 className="main-title-text">
                      Pimp Your <span className="main-title-highlight">Grill</span>
                  </h1>
              </div>
          </div>

          <div className="call-to-action-band">
              <p className="cta-text">
                  Înregistrează-te pentru a intra și tu în cea mai mare <br />rețea de grătaragii din lume!
              </p>
              <button 
                  onClick={() => setCurrentPage('register')}
                  className="cta-button"
              >
                  Register Now!
              </button>
          </div>
          
          <div className="homepage-bottom-section">
              
              <div className="louis-section">
                  <img src={LouisSvg} alt="Louis Family Guy" className="louis-img" />
              </div>

          </div>
      </div>
    );
};

const AuthPage = ({ type, onAuthSuccess, setCurrentPage }) => {
  const [formData, setFormData] = useState({ full_name: '', phone: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const isRegister = type === 'register';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    setLoading(true); 

    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    const payload = isRegister 
        ? { full_name: formData.full_name, phone: formData.phone, email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password };

    if (isRegister && formData.password !== formData.confirmPassword) {
        setLoading(false);
        return setError("Parolele nu se potrivesc!");
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setLoading(false);
        return setError("Adresă de email invalidă.");
    }

    try {
      const data = await fetchApi(endpoint, { method: 'POST', body: JSON.stringify(payload) });
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data._id || data.user?._id); 

      await onAuthSuccess(data); 

    } catch (err) {
      setError(`Eroare de autentificare: ${err.message}`);
    } finally {
        setLoading(false); 
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-minimalist">
        <h2 className="auth-card-title">{isRegister ? 'Înregistrare' : 'Login'} 🧑‍🍳</h2>
        {error && <p className="auth-error-message">⚠️ {error}</p>}
        
        <form onSubmit={handleSubmit} className="auth-form-minimalist">
          {isRegister && (
            <>
              <input type="text" name="full_name" placeholder="Nume Complet" required onChange={handleChange} className="auth-input-minimalist" />
              <input type="tel" name="phone" placeholder="Telefon" required onChange={handleChange} className="auth-input-minimalist" />
            </>
          )}
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="auth-input-minimalist" />
          <input type="password" name="password" placeholder="Parolă" required onChange={handleChange} className="auth-input-minimalist" />
          {isRegister && (
            <input type="password" name="confirmPassword" placeholder="Confirmă Parola" required onChange={handleChange} className="auth-input-minimalist" />
          )}
          <button type="submit" className="auth-submit-btn-minimalist" disabled={loading}>
            {loading ? 'Se procesează...' : (isRegister ? 'Înregistrare' : 'Login')}
          </button>
        </form>

        <p className="auth-switch-text">
            {isRegister ? 'Ai deja un cont?' : 'Nu ai un cont?'}
            <span 
                className="auth-switch-link"
                onClick={() => setCurrentPage(isRegister ? 'login' : 'register')}
            >
                {isRegister ? ' Loghează-te' : ' Înregistrează-te'}
            </span>
        </p>
      </div>
    </div>
  );
};

const PostGrillModal = ({ grillToEdit, onClose, onPostSuccess }) => {
    const [name, setName] = useState(grillToEdit?.name || '');
    const [description, setDescription] = useState(grillToEdit?.description || '');
    const isEdit = !!grillToEdit;

    const handleSubmit = async (e) => {
      e.preventDefault();

      const method = isEdit ? 'PUT' : 'POST';
      const endpoint = isEdit ? `/grills/${grillToEdit._id}` : '/grills';
      
      try {
        await fetchApi(endpoint, { method, body: JSON.stringify({ name, description }) });
        onPostSuccess(isEdit ? 'Grătar actualizat!' : 'Grătar postat cu succes!');
        onClose();
      } catch (err) {
        alert(`Eroare: ${err.message}`);
      }
    };

    return (
      <SimpleModal title={isEdit ? 'Editează Grătar' : 'Postează un Grătar Nou'} onClose={onClose}>
        <form onSubmit={handleSubmit} className="modal-form">
          <input 
              type="text" placeholder="Numele Rețetei" value={name}
              onChange={(e) => setName(e.target.value)} required 
              className="modal-input" 
          />
          <textarea 
              placeholder="Descriere detaliată" value={description}
              onChange={(e) => setDescription(e.target.value)} required 
              rows="3" className="modal-input modal-textarea" 
          />
          <button type="submit" className="modal-submit-btn">
            {isEdit ? 'Salvează Modificările' : 'Postează Grătarul!'}
          </button>
        </form>
      </SimpleModal>
    );
};

const ProfilePage = ({ user, refreshGrills, handleLogout }) => {
    const [userGrills, setUserGrills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGrill, setEditingGrill] = useState(null);

    const fetchProfileData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchApi('/user/profile');
            setUserGrills(data.grills || []); 
        } catch (err) {
            console.error('Eroare la preluarea profilului:', err);
            handleLogout(); 
        } finally {
            setLoading(false);
        }
    }, [handleLogout]);

    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    const handlePostSuccess = (message) => {
        alert(message); 
        fetchProfileData();
        if (refreshGrills) refreshGrills();
    };

    const handleDelete = async (grillId) => {
        if (!window.confirm('Ești sigur că vrei să ștergi?')) return;
        
        try {
            await fetchApi(`/grills/${grillId}`, { method: 'DELETE' });
            handlePostSuccess('Grătar șters.');
        } catch (err) {
            alert(`Eroare la ștergere: ${err.message}`);
        }
    };
    
    const handleEdit = (grill) => {
        setEditingGrill(grill);
        setIsModalOpen(true);
    };
    
    const handleDummyLike = () => alert("Dă like-uri doar din pagina Best Grills!");

    if (loading) return <div className="loading-text">Se încarcă profilul...</div>;

    return (
        <div className="profile-container">
            <h2 className="profile-title">Profilul Meu 🌟</h2>

            <div className="profile-layout-grid">
                <div className="profile-details-card">
                    <h3 className="profile-name">{user.full_name || 'Grill Pimp'}</h3>
                    <p className="profile-info">📧 Email: {user.email}</p>
                    <p className="profile-info">📞 Telefon: {user.phone || 'N/A'}</p>
                    <p className="profile-info">👑 Rol: **{user.role}**</p>

                    <button 
                        onClick={() => { setEditingGrill(null); setIsModalOpen(true); }}
                        className="post-grill-btn"
                    >
                        + Postează un Grill Nou
                    </button>
                </div>

                <div>
                    <h3 className="user-grills-title">Grill-urile Mele ({userGrills.length})</h3>
                    {userGrills.length === 0 ? (
                        <p className="no-grills-text">Nu ai postat încă niciun grătar. Fii primul!</p>
                    ) : (
                        <div className="user-grills-grid">
                            {userGrills.map(grill => (
                                <GrillCard 
                                    key={grill._id} 
                                    grill={{...grill, isLiked: false}} 
                                    user={user} 
                                    onDelete={handleDelete}
                                    onEdit={handleEdit}
                                    onLike={handleDummyLike} 
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <PostGrillModal 
                    grillToEdit={editingGrill}
                    onClose={() => { setIsModalOpen(false); setEditingGrill(null); }}
                    onPostSuccess={handlePostSuccess}
                />
            )}
        </div>
    );
};

const LeaderboardPage = ({ user }) => {
    const [allGrills, setAllGrills] = useState([]);
    const [bestGrills, setBestGrills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const getLocalLikes = useCallback(() => {
        try {
            return user ? JSON.parse(localStorage.getItem(`userLikes_${user._id}`) || '{}') : {};
        } catch { return {}; }
    }, [user]);
    
    const setLocalLikes = useCallback((likesMap) => {
        if(user) localStorage.setItem(`userLikes_${user._id}`, JSON.stringify(likesMap));
    }, [user]);

    const fetchGrills = useCallback(async () => {
        try {
            setLoading(true);
            const [all, best] = await Promise.all([
                fetchApi('/grills'), 
                fetchApi('/grills/best') 
            ]);
            
            const userLikes = getLocalLikes();
            const mapGrillData = (grills) => grills.map(g => ({ ...g, isLiked: !!userLikes[g._id] }));

            setAllGrills(mapGrillData(all));
            setBestGrills(mapGrillData(best));

        } catch (err) {
            alert(`Eroare la preluarea datelor: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [user, getLocalLikes]);

    useEffect(() => {
        fetchGrills();
    }, [fetchGrills]);
    
    const handleLikeToggle = async (grillId) => {
        if (!user) {
            alert('Trebuie să fii logat pentru a da un MIC!');
            return;
        }

        try {
            const data = await fetchApi(`/grills/${grillId}/like`, { method: 'POST' });
            
            const isLikedNow = data.action === 'liked';
            let newLikes = getLocalLikes();

            if (isLikedNow) {
                newLikes[grillId] = true;
                alert('MIC adăugat!');
            } else {
                delete newLikes[grillId];
                alert('MIC scos!');
            }
            setLocalLikes(newLikes); 

            const updateGrillState = (prev) => prev.map(g => g._id === grillId ? { 
                ...g, 
                mics_count: g.mics_count + (isLikedNow ? 1 : -1),
                isLiked: isLikedNow
            } : g);

            setAllGrills(updateGrillState);
            setBestGrills(updateGrillState(bestGrills).sort((a, b) => b.mics_count - a.mics_count)); 

        } catch (err) {
            alert(`Eroare la Like: ${err.message}`);
        }
    };
    
    const openDetailsModal = (grill) => {
        alert(`Detalii Grătar: ${grill.name}\nDescriere: ${grill.description}\nMICI: ${grill.mics_count}`);
    }
    
    const filteredGrills = allGrills.filter(grill =>
        grill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grill.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="loading-text">Se încarcă grătarele...</div>;

    return (
        <div className="leaderboard-container">
            <h2 className="leaderboard-title">THE BEST GRILLS 🔥</h2>

            <div className="leaderboard-top-section">
                <h3 className="leaderboard-subtitle">Top 3 Grills</h3>
                <div className="top-grills-grid">
                    {bestGrills.slice(0, 3).map((grill, index) => (
                        <div 
                            key={grill._id} 
                            className="top-grill-card"
                            onClick={() => openDetailsModal(grill)}
                        >
                            <span className="rank-badge">#{index + 1}</span>
                            <h4 className="top-grill-name">{grill.name}</h4>
                            <p className="top-grill-mics">MICI: {grill.mics_count}</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleLikeToggle(grill._id); }} 
                                className="like-toggle-btn"
                            >
                                {grill.isLiked ? 'SCOATE MIC' : 'DĂ UN MIC'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <h3 className="grills-for-pimps-title">Grills for Pimps 🥩</h3>
            
            <div className="search-bar-container">
              <span className="search-icon">🔍</span>
              <input
                  type="text"
                  placeholder="Caută Grătar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
              />
            </div>
            
            <div className="all-grills-grid">
                {filteredGrills.map(grill => (
                    <GrillCard 
                        key={grill._id} 
                        grill={grill} 
                        user={user} 
                        onLike={handleLikeToggle}
                        onDelete={() => alert('Șterge din Profil.')}
                        onEdit={() => alert('Editează din Profil.')}
                    />
                ))}
            </div>
        </div>
    );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('leaderboard'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchApi('/user/profile')
        .then(data => setUser(data.user)) 
        .catch(() => handleLogout()); 
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCurrentPage('leaderboard');
    alert('Ai fost delogat.');
  };
  
  const handleAuthSuccess = async () => {
    try {
      const profileData = await fetchApi('/user/profile');
      setUser(profileData.user);
      setCurrentPage('profile'); 
    } catch (err) {
      alert('Eroare la încărcarea profilului după autentificare');
      handleLogout();
    }
  };

  
  const refreshLeaderboard = () => setCurrentPage('leaderboard');
  
  const renderPage = () => {
    if (!user && currentPage === 'leaderboard') {
        return <StaticHomePage setCurrentPage={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'login':
        return <AuthPage type="login" onAuthSuccess={handleAuthSuccess} setCurrentPage={setCurrentPage} />;
      case 'register':
        return <AuthPage type="register" onAuthSuccess={handleAuthSuccess} setCurrentPage={setCurrentPage} />;
      case 'profile':
        return user ? <ProfilePage user={user} refreshGrills={refreshLeaderboard} handleLogout={handleLogout} /> : <AuthPage type="login" onAuthSuccess={handleAuthSuccess} setCurrentPage={setCurrentPage} />;
      case 'leaderboard':
      default:
        return <LeaderboardPage user={user} />;
    }
  };

  const navItems = [
    { name: 'Best Grills', page: 'leaderboard', isCurrent: currentPage === 'leaderboard' },
    ...(user
      ? [
          { name: 'Profile', page: 'profile', isCurrent: currentPage === 'profile' }, 
          { name: 'Logout', action: handleLogout, isCurrent: false } 
        ]
      : [
          { name: 'Login', page: 'login', isCurrent: currentPage === 'login' }, 
          { name: 'Register', page: 'register', isCurrent: currentPage === 'register' }
        ]
    ),
  ];

  return (
    <div className="app-main-container">
      
      <header className="main-header">
        <div className="header-content-wrapper">
          
          <div className="logo-section" onClick={() => setCurrentPage('leaderboard')}>
            <img src={LogoGrill} alt="Logo" className="logo-img" />
            <h1 className="logo-text">Pimp Your Grill</h1>
          </div>
          
          <nav className="nav-desktop">
            {navItems.map(item => (
              <button
                key={item.name}
                onClick={() => item.action ? item.action() : setCurrentPage(item.page)}
                className={item.isCurrent ? 'nav-btn current' : 'nav-btn'}
              >
                {item.name}
              </button>
            ))}
            {user && <span className="user-greeting">Salut, **{user.full_name?.split(' ')[0] || 'Grill Master'}**!</span>}
          </nav>
          
          <button className="menu-toggle-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
        
        {isMenuOpen && (
          <nav className="nav-mobile">
            {navItems.map(item => (
              <button
                key={item.name}
                onClick={() => { item.action ? item.action() : setCurrentPage(item.page); setIsMenuOpen(false); }}
                className={item.isCurrent ? 'mobile-nav-btn current' : 'mobile-nav-btn'}
              >
                {item.name}
              </button>
            ))}
              {user && <span className="user-greeting-mobile">Salut, **{user.full_name?.split(' ')[0] || 'Grill Master'}**!</span>}
          </nav>
        )}
      </header>
      
      <main>
        {renderPage()}
      </main>

      <footer className="main-footer">
        <p className="footer-contact">Contact: LSAC | Email: contact@lsac.ro</p>
        <div className="footer-social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">📘 [FB]</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">📸 [IG]</a>
        </div>
      </footer>
    </div>
  );
};

export default App;

import React, { useState } from "react";
import {
  Container,
  Paper,
  Grid,
  Avatar,
  Typography,
  Box,
  Tabs,
  Tab,
  Chip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  TextField,
  Tooltip,
  Modal, 
  Backdrop, 
  Fade, 
  IconButton, 
  Snackbar,
  Alert,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

// Icons
import SchoolIcon from "@mui/icons-material/School";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import BarChartIcon from "@mui/icons-material/BarChart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import TimelineIcon from "@mui/icons-material/Timeline";
import CloseIcon from "@mui/icons-material/Close"; 
import ZoomInIcon from '@mui/icons-material/ZoomIn'; 
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Import hình ảnh (Đảm bảo đường dẫn đúng)
import BadgeMastery from "../../assets/images/Badge.png";
import Avatar1 from "../../assets/images/Avatar.jpg";

// --- DỮ LIỆU MẪU (API-READY VỚI CSDL migration.sql) ---
const initialStudentData = {
  name: "Nguyễn Hàm Hoàng",
  school: "Trường THCS Lê Quý Đôn",
  avatarUrl: Avatar1,
  motto: "Học, học nữa, học mãi!",
  studyStreak: 15,
  totalHours: 72,
  questionsAnswered: 830,
  avgCorrectPercent: 78,
};

const competencyData = [
    { subject: 'Căn bậc hai', mastery: 90, fullMark: 100 },
    { subject: 'Hàm số bậc nhất', mastery: 75, fullMark: 100 },
    { subject: 'Hệ phương trình', mastery: 60, fullMark: 100 },
    { subject: 'Hình học (Ch. 1)', mastery: 85, fullMark: 100 },
    { subject: 'Tỉ số lượng giác', mastery: 95, fullMark: 100 },
    { subject: 'Đường tròn', mastery: 55, fullMark: 100 },
];

const skillsToImprovePreview = [
    { id: 1, name: 'Giải phương trình chứa căn', mastery: 45 },
    { id: 2, name: 'Tiếp tuyến đường tròn', mastery: 52 },
    { id: 3, name: 'Hệ thức Vi-ét', mastery: 60 },
];
const allSkillsToImprove = [
    ...skillsToImprovePreview,
    { id: 4, name: 'Góc nội tiếp', mastery: 62 },
    { id: 5, name: 'Phương trình bậc hai', mastery: 68 },
    { id: 6, name: 'Bất đẳng thức', mastery: 30 },
];

const badgesPreview = [
    { id: 1, name: 'Bậc thầy Lượng giác', icon: BadgeMastery, date: '01/11/2025' },
    { id: 2, name: 'Chiến binh (50+)', icon: BadgeMastery, date: '30/10/2025' },
    { id: 3, name: 'Cú đêm', icon: BadgeMastery, date: '28/10/2025' },
    { id: 4, name: 'Chuyên gia Căn bậc hai', icon: BadgeMastery, date: '25/10/2025' },
];
const allBadges = [
    ...badgesPreview,
    { id: 5, name: 'Người bắt đầu', icon: BadgeMastery, date: '01/10/2025' },
    { id: 6, name: 'Nhà thám hiểm', icon: BadgeMastery, date: '05/10/2025' },
    { id: 7, name: 'Học giả', icon: BadgeMastery, date: '10/10/2025' },
    { id: 8, name: 'Bậc thầy Hình học', icon: BadgeMastery, date: '15/10/2025' },
];
// ------------------------------

// --- STYLED COMPONENTS ---
const ProfileCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    height: '100%',
    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
    border: `1px solid ${theme.palette.divider}`,
}));

const StatCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(2),
    height: '100%',
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
    boxShadow: 'none',
}));

const ModalCard = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90vw',
    maxWidth: '800px', 
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: 24,
    padding: theme.spacing(4),
}));

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const BadgeItem = ({ badge }) => (
    <Tooltip title={`Đạt được ngày ${badge.date}`} placement="top">
        <Box sx={{ textAlign: 'center', p: 1, width: 90 }}>
            <motion.img
                src={badge.icon}
                alt={badge.name}
                width={70}
                height={70}
                style={{ filter: 'drop-shadow(0px 4px 4px rgba(0,0,0,0.1))' }}
                whileHover={{ scale: 1.1, rotate: 5 }}
            />
            <Typography variant="caption" display="block" sx={{ mt: 0.5, fontWeight: 500, lineHeight: 1.2 }}>
                {badge.name}
            </Typography>
        </Box>
    </Tooltip>
);

const SkillItem = ({ skill, onPracticeClick }) => (
    <ListItem>
        <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'error.light' }}>
                <TrendingDownIcon />
            </Avatar>
        </ListItemAvatar>
        <ListItemText
            primary={skill.name}
            secondary={`${skill.mastery}% Thành thạo`}
        />
        <Button size="small" variant="outlined" onClick={() => onPracticeClick(skill.name)}>
            Luyện tập
        </Button>
    </ListItem>
);
// ------------------------------


// --- COMPONENT CHÍNH ---
export default function StudentProfilePage() {
    const [tabValue, setTabValue] = useState(0);
    const [isRadarModalOpen, setIsRadarModalOpen] = useState(false); 
    const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false); 
    const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false); 
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });

    // State quản lý dữ liệu profile chính
    const [profileData, setProfileData] = useState(initialStudentData);
    
    // State quản lý form thông tin
    const [formInput, setFormInput] = useState({
        name: initialStudentData.name, 
        school: initialStudentData.school,
        motto: initialStudentData.motto,
    });

    // *** (1) BỔ SUNG STATE CHO FORM MẬT KHẨU ***
    const [passwordInput, setPasswordInput] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');
    // ---------------------------------------------

    const handleChangeTab = (event, newValue) => {
        setTabValue(newValue);
    };

    // Handlers cho 3 Modal
    const handleOpenRadarModal = () => setIsRadarModalOpen(true);
    const handleCloseRadarModal = () => setIsRadarModalOpen(false);
    const handleOpenBadgesModal = () => setIsBadgesModalOpen(true);
    const handleCloseBadgesModal = () => setIsBadgesModalOpen(false);
    const handleOpenSkillsModal = () => setIsSkillsModalOpen(true);
    const handleCloseSkillsModal = () => setIsSkillsModalOpen(false);

    // Handlers cho Thông báo
    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setToast(prev => ({ ...prev, open: false }));
    };

    // Hàm "Lưu thay đổi" (Thông tin cá nhân)
    const handleSaveChanges = () => {
        setProfileData(prevData => ({
            ...prevData,
            name: formInput.name,
            school: formInput.school,
            motto: formInput.motto,
        }));
        // (API call sẽ ở đây)
        setToast({ open: true, message: 'Cập nhật thông tin thành công!', severity: 'success' });
    };
    
    // *** (2) BỔ SUNG LOGIC CHO HÀM "ĐỔI MẬT KHẨU" ***
    const handleChangePassword = () => {
        // 1. Kiểm tra trùng khớp
        if (passwordInput.newPassword !== passwordInput.confirmPassword) {
            setPasswordError('Mật khẩu mới không trùng khớp');
            setToast({ open: true, message: 'Đổi mật khẩu thất bại! Mật khẩu mới không trùng khớp.', severity: 'error' });
            return;
        }
        
        // 2. Kiểm tra rỗng
        if (!passwordInput.currentPassword || !passwordInput.newPassword) {
             setToast({ open: true, message: 'Vui lòng điền đầy đủ thông tin.', severity: 'warning' });
            return;
        }
        
        // 3. (Giả lập API call)
        // Giả sử mật khẩu cũ đúng là '123456'
        if (passwordInput.currentPassword !== '123456') {
             setToast({ open: true, message: 'Đổi mật khẩu thất bại! Mật khẩu cũ không đúng.', severity: 'error' });
        } else {
             setToast({ open: true, message: 'Đổi mật khẩu thành công!', severity: 'success' });
             // Xóa state sau khi thành công
             setPasswordInput({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setPasswordError('');
        }
    };
    // ----------------------------------------------------

    const handlePracticeClick = (skillName) => {
        setToast({ open: true, message: `Đang chuẩn bị bài luyện tập cho: ${skillName}...`, severity: 'info' });
        // (Sau này sẽ thay bằng navigate(`/student/practice/${skillId}`))
    };

    // Hàm cập nhật state cho form thông tin
    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setFormInput(prevInput => ({
            ...prevInput,
            [name]: value,
        }));
    };

    // *** (3) BỔ SUNG HÀM CẬP NHẬT STATE CHO FORM MẬT KHẨU ***
    const handlePasswordInputChange = (event) => {
        const { name, value } = event.target;
        const newPasswordState = {
            ...passwordInput,
            [name]: value,
        };
        setPasswordInput(newPasswordState);

        // Kiểm tra lỗi trùng khớp ngay khi gõ
        if (name === 'newPassword' || name === 'confirmPassword') {
            const newPass = (name === 'newPassword') ? value : newPasswordState.newPassword;
            const confirmPass = (name === 'confirmPassword') ? value : newPasswordState.confirmPassword;

            if (confirmPass && newPass !== confirmPass) {
                setPasswordError('Mật khẩu mới không trùng khớp');
            } else {
                setPasswordError(''); // Xóa lỗi nếu khớp
            }
        }
    };
    // --------------------------------------------------------

    // *** (4) BỔ SUNG LOGIC VALIDATE NÚT ĐỔI MẬT KHẨU ***
    const isPasswordFormValid = 
        passwordInput.currentPassword.length > 0 &&
        passwordInput.newPassword.length > 0 &&
        passwordInput.confirmPassword.length > 0 &&
        passwordInput.newPassword === passwordInput.confirmPassword &&
        !passwordError; // Đảm bảo không có lỗi
    // ---------------------------------------------------


    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5
            }
        })
    };

    // Hàm render Biểu đồ (để tái sử dụng)
    const renderRadarChart = () => (
        <ResponsiveContainer width="100%" height={350}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencyData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                    name="Mức độ Thành thạo"
                    dataKey="mastery"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                />
                <Legend />
            </RadarChart>
        </ResponsiveContainer>
    );

    return (
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
        
            {/* === HÀNG 1: AVATAR VÀ STATS === */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible">
                        <ProfileCard sx={{ textAlign: 'center' }}>
                            <Avatar
                                src={profileData.avatarUrl}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    margin: 'auto',
                                    mb: 2,
                                    border: (theme) => `4px solid ${theme.palette.primary.main}`
                                }}
                            />
                            <Typography variant="h5" sx={{ fontWeight: 600 }}>
                                {profileData.name}
                            </Typography>
                            <Chip
                                icon={<SchoolIcon />}
                                label={profileData.school}
                                variant="outlined"
                                color="secondary"
                                sx={{ mt: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                                "{profileData.motto}"
                            </Typography>
                        </ProfileCard>
                    </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Grid container spacing={2} sx={{ height: '100%' }}>
                        <Grid item xs={6}>
                            <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" style={{ height: '100%' }}>
                                <StatCard>
                                    <WhatshotIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>{profileData.studyStreak}</Typography>
                                        <Typography variant="body2" color="text.secondary">Ngày học</Typography>
                                    </Box>
                                </StatCard>
                            </motion.div>
                        </Grid>
                        <Grid item xs={6}>
                            <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" style={{ height: '100%' }}>
                                <StatCard>
                                    <BarChartIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>{profileData.questionsAnswered}</Typography>
                                        <Typography variant="body2" color="text.secondary">Câu đã làm</Typography>
                                    </Box>
                                </StatCard>
                            </motion.div>
                        </Grid>
                        <Grid item xs={6}>
                            <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" style={{ height: '100%' }}>
                                <StatCard>
                                    <CheckCircleIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>{profileData.avgCorrectPercent}%</Typography>
                                        <Typography variant="body2" color="text.secondary">Tỷ lệ đúng</Typography>
                                    </Box>
                                </StatCard>
                            </motion.div>
                        </Grid>
                        <Grid item xs={6}>
                            <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" style={{ height: '100%' }}>
                                <StatCard>
                                    <TimelineIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                                    <Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>{profileData.totalHours}</Typography>
                                        <Typography variant="body2" color="text.secondary">Giờ học</Typography>
                                    </Box>
                                </StatCard>
                            </motion.div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid> 
            
            {/* === HÀNG 2: KHU VỰC TABS === */}
            <Grid container sx={{ mt: 3 }}>
                <Grid item xs={12}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleChangeTab} centered>
                            <Tab label="Hồ sơ Năng lực" icon={<AccountCircleIcon />} iconPosition="start" />
                            <Tab label="Cài đặt Tài khoản" icon={<SettingsIcon />} iconPosition="start" />
                        </Tabs>
                    </Box>
                </Grid>
            </Grid>
            
            {/* === HÀNG 3: NỘI DUNG CỦA TABS === */}

            {/* NỘI DUNG TAB 1: HỒ SƠ NĂNG LỰC */}
            <TabPanel value={tabValue} index={0}>
                <Grid container spacing={3} justifyContent="center"> 
                    <Grid item xs={12} lg={6}>
                        <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible" style={{ height: '100%' }}>
                            <ProfileCard 
                                onClick={handleOpenRadarModal} 
                                sx={{ 
                                    cursor: 'pointer', 
                                    position: 'relative',
                                    '&:hover .zoom-icon': { opacity: 1, transform: 'scale(1.1)' },
                                    '&:hover': { borderColor: 'primary.main', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.08)' }
                                }}
                            >
                                <Box 
                                    className="zoom-icon"
                                    sx={{ 
                                        position: 'absolute', 
                                        top: 16, 
                                        right: 16, 
                                        opacity: 0.3, 
                                        transition: 'all 0.2s' 
                                    }}
                                >
                                    <ZoomInIcon />
                                </Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Bản đồ Năng lực (Toán 9)
                                </Typography>
                                {renderRadarChart()} 
                            </ProfileCard>
                        </motion.div>
                    </Grid>

                    <Grid item xs={12} lg={6}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 3 }}>
                            <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible">
                                <Paper sx={{ 
                                    p: 3, 
                                    borderRadius: 4, 
                                    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)', 
                                    border: (theme) => `1px solid ${theme.palette.divider}` 
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Huy hiệu
                                        </Typography>
                                        <Button 
                                            size="small" 
                                            endIcon={<ArrowForwardIcon />}
                                            onClick={handleOpenBadgesModal}
                                        >
                                            Xem tất cả ({allBadges.length})
                                        </Button>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'start', flexWrap: 'wrap' }}>
                                        {badgesPreview.map((badge) => (
                                            <BadgeItem key={badge.id} badge={badge} />
                                        ))}
                                    </Box>
                                </Paper>
                            </motion.div>

                            <motion.div custom={7} variants={cardVariants} initial="hidden" animate="visible" style={{ flexGrow: 1 }}>
                                <ProfileCard>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Kỹ năng cần cải thiện
                                        </Typography>
                                        <Button 
                                            size="small" 
                                            endIcon={<ArrowForwardIcon />}
                                            onClick={handleOpenSkillsModal}
                                        >
                                            Xem tất cả ({allSkillsToImprove.length})
                                        </Button>
                                    </Box>
                                    <List dense>
                                        {skillsToImprovePreview.map((skill) => (
                                            <SkillItem key={skill.id} skill={skill} onPracticeClick={handlePracticeClick} />
                                        ))}
                                    </List>
                                </ProfileCard>
                            </motion.div>
                        </Box>
                    </Grid>
                </Grid>
            </TabPanel>

            {/* NỘI DUNG TAB 2: CÀI ĐẶT TÀI KHOẢN */}
            <TabPanel value={tabValue} index={1}>
                <Grid container spacing={3} justifyContent="center">
                    {/* Form Thông tin cá nhân */}
                    <Grid item xs={12} md={6}>
                        <ProfileCard>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Thông tin cá nhân (UC_GS04)
                            </Typography>
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField 
                                    label="Họ và tên"
                                    name="name" 
                                    value={formInput.name} 
                                    onChange={handleFormChange} 
                                    variant="filled"
                                />
                                <TextField 
                                    label="Email" 
                                    defaultValue="nguyenhamhoang@email.com" 
                                    disabled 
                                    variant="filled"
                                />
                                <TextField 
                                    label="Trường học" 
                                    name="school" 
                                    value={formInput.school} 
                                    onChange={handleFormChange} 
                                    variant="filled"
                                />
                                <TextField 
                                    label="Khẩu hiệu" 
                                    name="motto" 
                                    value={formInput.motto} 
                                    onChange={handleFormChange} 
                                    variant="filled"
                                />
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    sx={{ mt: 1, alignSelf: 'flex-end' }}
                                    onClick={handleSaveChanges} 
                                >
                                    Lưu thay đổi
                                </Button>
                            </Box>
                        </ProfileCard>
                    </Grid>

                    {/* *** (5) SỬA LẠI FORM MẬT KHẨU ĐỂ KẾT NỐI STATE VÀ LOGIC *** */}
                    <Grid item xs={12} md={6}>
                        <ProfileCard>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Thay đổi mật khẩu (UC_GS06)
                            </Typography>
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <TextField 
                                    label="Mật khẩu cũ" 
                                    type="password" 
                                    variant="filled" 
                                    name="currentPassword"
                                    value={passwordInput.currentPassword}
                                    onChange={handlePasswordInputChange}
                                />
                                <TextField 
                                    label="Mật khẩu mới" 
                                    type="password" 
                                    variant="filled" 
                                    name="newPassword"
                                    value={passwordInput.newPassword}
                                    onChange={handlePasswordInputChange}
                                    error={!!passwordError} // Hiển thị lỗi nếu có
                                />
                                <TextField 
                                    label="Xác nhận mật khẩu mới" 
                                    type="password" 
                                    variant="filled" 
                                    name="confirmPassword"
                                    value={passwordInput.confirmPassword}
                                    onChange={handlePasswordInputChange}
                                    error={!!passwordError} // Hiển thị lỗi nếu có
                                    helperText={passwordError} // Hiển thị tin nhắn lỗi
                                />
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    sx={{ mt: 1, alignSelf: 'flex-end' }}
                                    onClick={handleChangePassword}
                                    disabled={!isPasswordFormValid} // Bật/tắt nút dựa trên state
                                >
                                    Đổi mật khẩu
                                </Button>
                            </Box>
                        </ProfileCard>
                    </Grid>
                    {/* ----------------------------------------------------------- */}
                </Grid>
            </TabPanel>


            {/* === SNACKBAR (THÔNG BÁO) === */}
            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }} variant="filled">
                    {toast.message}
                </Alert>
            </Snackbar>

            {/* === MODAL BẢN ĐỒ NĂNG LỰC === */}
            <Modal
                open={isRadarModalOpen}
                onClose={handleCloseRadarModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={isRadarModalOpen}>
                    <ModalCard>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                                Bản đồ Năng lực (Toán 9)
                            </Typography>
                            <IconButton onClick={handleCloseRadarModal}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ height: '70vh', maxHeight: '500px' }}>
                            {renderRadarChart()}
                        </Box>
                    </ModalCard>
                </Fade>
            </Modal>
            
            {/* === MODAL XEM TẤT CẢ HUY HIỆU === */}
            <Modal
                open={isBadgesModalOpen}
                onClose={handleCloseBadgesModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={isBadgesModalOpen}>
                    <ModalCard sx={{ maxWidth: '600px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                                Toàn bộ Huy hiệu ({allBadges.length})
                            </Typography>
                            <IconButton onClick={handleCloseBadgesModal}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ 
                            maxHeight: '70vh', 
                            overflowY: 'auto', 
                            display: 'flex', 
                            flexWrap: 'wrap', 
                            justifyContent: 'center',
                            gap: 2
                        }}>
                            {allBadges.map((badge) => (
                                <BadgeItem key={badge.id} badge={badge} />
                            ))}
                        </Box>
                    </ModalCard>
                </Fade>
            </Modal>

            {/* === MODAL XEM TẤT CẢ KỸ NĂNG === */}
            <Modal
                open={isSkillsModalOpen}
                onClose={handleCloseSkillsModal}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500 } }}
            >
                <Fade in={isSkillsModalOpen}>
                    <ModalCard sx={{ maxWidth: '600px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                                Kỹ năng cần cải thiện ({allSkillsToImprove.length})
                            </Typography>
                            <IconButton onClick={handleCloseSkillsModal}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <List sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            {allSkillsToImprove.map((skill) => (
                                <SkillItem key={skill.id} skill={skill} onPracticeClick={handlePracticeClick} />
                            ))}
                        </List>
                    </ModalCard>
                </Fade>
            </Modal>

        </Container>
    );
}
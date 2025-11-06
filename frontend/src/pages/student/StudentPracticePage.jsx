import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  LinearProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Icons
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School'; // Chương
import TopicIcon from '@mui/icons-material/Topic'; // Chủ đề
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Kỹ năng
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

// --- DỮ LIỆU MẪU (Mô phỏng cấu trúc Categories phân cấp) ---
const mockSkillTree = [
    {
        id: 'c_01',
        name: 'Chương 1: Căn bậc hai và Hàm số',
        type: 'chapter',
        progress: 75,
        children: [
            {
                id: 't_01.1',
                name: 'Chủ đề 1: Căn bậc hai',
                type: 'topic',
                progress: 80,
                children: [
                    { id: 's_01.1.1', name: 'Định nghĩa căn bậc hai', type: 'skill', progress: 95 },
                    { id: 's_01.1.2', name: 'Hằng đẳng thức căn', type: 'skill', progress: 85 },
                    { id: 's_01.1.3', name: 'Rút gọn biểu thức chứa căn', type: 'skill', progress: 60 },
                ]
            },
            {
                id: 't_01.2',
                name: 'Chủ đề 2: Hàm số và Đồ thị',
                type: 'topic',
                progress: 70,
                children: [
                    { id: 's_01.2.1', name: 'Định nghĩa Hàm số', type: 'skill', progress: 80 },
                    { id: 's_01.2.2', name: 'Đồ thị hàm số bậc nhất', type: 'skill', progress: 70 },
                ]
            }
        ]
    },
    {
        id: 'c_02',
        name: 'Chương 2: Hệ phương trình bậc nhất',
        type: 'chapter',
        progress: 50,
        children: []
    }
];
// ------------------------------

// --- STYLED COMPONENTS ---
const PracticeCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
    border: `1px solid ${theme.palette.divider}`,
    height: '100%',
}));

// Component hiển thị tiến độ
const ProgressItem = ({ value }) => (
    <Box sx={{ minWidth: 50 }}>
        <Typography variant="body2" color="text.secondary">
            {`${Math.round(value)}%`}
        </Typography>
        <LinearProgress 
            variant="determinate" 
            value={value} 
            sx={{ height: 6, borderRadius: 3 }} 
            color={value > 80 ? 'success' : value > 50 ? 'warning' : 'error'}
        />
    </Box>
);

// Component đệ quy hiển thị cây kỹ năng
const SkillItem = ({ item, onStartPractice, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    const hasChildren = item.children && item.children.length > 0;

    const handleToggle = () => {
        if (hasChildren) {
            setOpen(!open);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'chapter': return <SchoolIcon color="primary" />;
            case 'topic': return <TopicIcon color="secondary" />;
            case 'skill': return <CheckCircleIcon color="success" />;
            default: return <TopicIcon />;
        }
    };

    return (
        <Box>
            <ListItem 
                button={hasChildren} 
                onClick={handleToggle}
                sx={{ 
                    pl: item.type === 'skill' ? 6 : item.type === 'topic' ? 4 : 2, 
                    borderLeft: item.type === 'skill' ? `3px solid ${item.progress > 80 ? 'green' : 'orange'}` : 'none',
                    backgroundColor: item.type === 'skill' ? 'action.hover' : 'inherit',
                    borderRadius: item.type === 'skill' ? 1 : 0,
                    mt: item.type === 'skill' ? 0.5 : 0,
                }}
            >
                <ListItemIcon sx={{ minWidth: 32 }}>
                    {getIcon(item.type)}
                </ListItemIcon>
                <ListItemText primary={item.name} sx={{ fontWeight: 600 }} />
                
                {item.type !== 'skill' && <ProgressItem value={item.progress} />}

                {item.type === 'skill' && (
                    <Button 
                        variant="contained" 
                        size="small"
                        startIcon={<PlayArrowIcon />}
                        onClick={(e) => { e.stopPropagation(); onStartPractice(item); }}
                        sx={{ ml: 2, textTransform: 'none' }}
                    >
                         Luyện tập
                    </Button>
                )}
                {hasChildren ? (open ? <ExpandLess /> : <ExpandMore />) : null}
            </ListItem>

            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {item.children.map((child) => (
                            <SkillItem 
                                key={child.id} 
                                item={child} 
                                onStartPractice={onStartPractice} 
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </Box>
    );
};
// ------------------------------

// --- COMPONENT CHÍNH ---
export default function StudentPracticePage() {
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    
    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') return;
        setToast(prev => ({ ...prev, open: false }));
    };
    
    const handleStartPractice = (skill) => {
        // Chuyển đến trang làm bài với ID kỹ năng
        // Route: /student/practice/:categoryId/session
        navigate(`/student/practice/${skill.id}/session`);
        setToast({ open: true, message: `Bắt đầu luồng luyện tập cho: ${skill.name}`, severity: 'info' });
    };

    // (Bạn có thể thêm logic lọc/tìm kiếm ở đây)
    // const filteredTree = mockSkillTree.filter(...)

    const motionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.1,
                duration: 0.5
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            
            {/* === TIÊU ĐỀ TRANG === */}
            <motion.div variants={motionVariants} initial="hidden" animate="visible">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        Luyện tập theo Chủ đề (UC_HS02)
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Chọn một kỹ năng bạn muốn củng cố để bắt đầu luồng câu hỏi thích ứng độ khó.
                    </Typography>
                </Box>
            </motion.div>

            {/* === CÂY KỸ NĂNG (SKILL TREE) === */}
            <motion.div variants={motionVariants} initial="hidden" animate="visible">
                <PracticeCard>
                    <List component="nav">
                        {mockSkillTree.map((chapter) => (
                            <SkillItem 
                                key={chapter.id} 
                                item={chapter} 
                                onStartPractice={handleStartPractice}
                                defaultOpen={true} // Mở mặc định cho cấp Chương
                            />
                        ))}
                    </List>
                </PracticeCard>
            </motion.div>

            {/* === SNACKBAR (THÔNG BÁO) === */}
            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }} variant="filled">
                    {toast.message}
                </Alert>
            </Snackbar>

        </Container>
    );
}
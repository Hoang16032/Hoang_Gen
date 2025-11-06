import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Snackbar,
  Alert,
  IconButton,
  LinearProgress,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";

// Icons
import CloseIcon from '@mui/icons-material/Close'; // Nút thoát
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

// *** (QUAN TRỌNG) TÁI SỬ DỤNG COMPONENT CÓ SẴN CỦA BẠN ***
import QuestionContentRenderer from "../../components/QuestionContentRenderer";

// --- DỮ LIỆU MẪU (Mô phỏng 3 câu hỏi để thể hiện luồng) ---

// --- DỮ LIỆU MẪU (ĐÃ SỬA SANG HTML) ---
const mockQuestion_Easy_1 = {
  id: "q_001",
  content: "<p>Kết quả của phép tính $\\sqrt{4} + \\sqrt{9}$ là bao nhiêu?</p>", // <-- SỬA 1
  type: "single", 
  level: "easy",
  explanation: "<p>Ta có $\\sqrt{4} = 2$ và $\\sqrt{9} = 3$. Vậy tổng là $2 + 3 = 5$.</p>", // <-- SỬA 2
  answers: [
    { id: "a_001", content: "<p>3</p>", isCorrect: false },
    { id: "a_002", content: "<p>5</p>", isCorrect: true },
    { id: "a_003", content: "<p>7</p>", isCorrect: false },
    { id: "a_004", content: "<p>13</p>", isCorrect: false },
  ],
};

const mockQuestion_Easy_2 = { 
  id: "q_002",
  content: "<p>$\\sqrt{x} = 3$ thì $x$ bằng bao nhiêu?</p>", // <-- SỬA 3
  type: "single",
  level: "easy",
  explanation: "<p>Bình phương hai vế, ta có $x = 3^2 = 9$.</p>", // <-- SỬA 4
  answers: [
    { id: "a_005", content: "<p>3</p>", isCorrect: false },
    { id: "a_006", content: "<p>6</p>", isCorrect: false },
    { id: "a_007", content: "<p>9</p>", isCorrect: true },
  ],
};

const mockQuestion_Medium_1 = { 
  id: "q_003",
  content: "<p>Rút gọn biểu thức $\\sqrt{(\\sqrt{3}-2)^2}$</p>", // <-- SỬA 5
  type: "single",
  level: "medium",
  explanation: "<p>Dùng hằng đẳng thức $\\sqrt{A^2} = |A|$. ...</p>", // <-- SỬA 6
  answers: [
    { id: "a_008", content: "<p>\\(\\sqrt{3}-2\\)</p>", isCorrect: false },
    { id: "a_009", content: "<p>\\(2 - \\sqrt{3}\\)</p>", isCorrect: true },
    { id: "a_010", content: "<p>1</p>", isCorrect: false },
  ],
};
// ------------------------------
// ------------------------------

// --- STYLED COMPONENTS ---
const PracticeHeader = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: 'none',
    border: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(3),
}));

const QuestionCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.05)',
    border: `1px solid ${theme.palette.divider}`,
    minHeight: '400px',
}));

const FeedbackBox = styled(Box)(({ theme, isCorrect }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(3),
    backgroundColor: alpha(isCorrect ? theme.palette.success.main : theme.palette.error.main, 0.1),
    border: `1px solid ${isCorrect ? theme.palette.success.main : theme.palette.error.main}`,
}));
// ------------------------------

// --- COMPONENT CHÍNH ---
export default function StudentPracticeSessionPage() {
    const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
    const { categoryId } = useParams(); // Lấy ID chủ đề từ URL
    const navigate = useNavigate();
    
    // State cho phiên làm bài
    const [currentQuestion, setCurrentQuestion] = useState(mockQuestion_Easy_1);
    const [selectedAnswerId, setSelectedAnswerId] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false); // Đã nộp bài chưa?
    const [isCorrect, setIsCorrect] = useState(false); // Kết quả đúng/sai
    const [questionCount, setQuestionCount] = useState(1);

    // (useEffect sẽ dùng để gọi API lấy câu hỏi đầu tiên)
    // useEffect(() => {
    //   // fetchNextQuestion(categoryId, null, null); 
    // }, [categoryId]);

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') return;
        setToast(prev => ({ ...prev, open: false }));
    };

    // Hàm chọn đáp án (truyền từ MultipleChoice lên)
    const handleAnswerSelect = (answerId) => {
        if (!isAnswered) { // Chỉ cho chọn khi chưa nộp
            setSelectedAnswerId(answerId);
        }
    };

    // Nút "Dừng lại"
    const handleStopSession = () => {
        // (Sau này có thể thêm Modal xác nhận)
        navigate('/student/practice'); // Quay lại trang chọn chủ đề
    };

    // Nút "Kiểm tra"
    const handleCheckAnswer = () => {
        if (!selectedAnswerId) {
            setToast({ open: true, message: 'Vui lòng chọn một đáp án!', severity: 'warning' });
            return;
        }

        const correctAnswer = currentQuestion.answers.find(ans => ans.isCorrect);
        if (correctAnswer.id === selectedAnswerId) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
        setIsAnswered(true); // Đã nộp
    };
    
    // Nút "Câu tiếp theo"
    const handleNextQuestion = () => {
        // (API thật: fetchNextQuestion(categoryId, currentQuestion.id, isCorrect))

        // *** LOGIC THÍCH ỨNG ĐỘ KHÓ (Mô phỏng) ***
        if (isCorrect) {
            // Nếu đúng -> Lên cấp
            setToast({ open: true, message: 'Chính xác! Tăng độ khó...', severity: 'success' });
            setCurrentQuestion(mockQuestion_Medium_1);
        } else {
            // Nếu sai -> Giữ nguyên cấp
            setToast({ open: true, message: 'Sai rồi! Thử câu dễ khác...', severity: 'error' });
            setCurrentQuestion(mockQuestion_Easy_2);
        }
        
        // Reset state
        setQuestionCount(prev => prev + 1);
        setSelectedAnswerId(null);
        setIsAnswered(false);
        setIsCorrect(false);
    };

    const motionVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            
            {/* === HEADER (Tiến độ và Nút thoát) === */}
            <motion.div variants={motionVariants} initial="hidden" animate="visible">
                <PracticeHeader>
                    <Box sx={{ width: '100%', mr: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Câu hỏi {questionCount} (Đang luyện tập: {categoryId})
                        </Typography>
                        <LinearProgress variant="determinate" value={(questionCount / 10) * 100} /> 
                    </Box>
                    <Button 
                        variant="outlined" 
                        color="error" 
                        onClick={handleStopSession}
                    >
                        Dừng lại
                    </Button>
                </PracticeHeader>
            </motion.div>
            
            {/* === THÂN (Câu hỏi) === */}
            <motion.div variants={motionVariants} initial="hidden" animate="visible">
                <QuestionCard>
                    {/* (TÁI SỬ DỤNG COMPONENT CỦA BẠN) */}
                    <QuestionContentRenderer
                        questionData={currentQuestion}
                        selectedAnswerId={selectedAnswerId}
                        onAnswerSelect={handleAnswerSelect}
                        isAnswered={isAnswered} // Truyền state "đã nộp"
                    />

                    {/* === PHẢN HỒI (Sau khi nộp) === */}
                    {isAnswered && (
                        <Fade in={isAnswered}>
                            <FeedbackBox isCorrect={isCorrect}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    {isCorrect ? <CheckCircleIcon color="success" /> : <CancelIcon color="error" />}
                                    <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                                        {isCorrect ? 'Chính xác!' : 'Sai rồi!'}
                                    </Typography>
                                </Box>
                                <Typography variant="body2">
                                    {currentQuestion.explanation}
                                </Typography>
                            </FeedbackBox>
                        </Fade>
                    )}
                </QuestionCard>
            </motion.div>

            {/* === FOOTER (Nút hành động) === */}
            <motion.div variants={motionVariants} initial="hidden" animate="visible">
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    {!isAnswered ? (
                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={handleCheckAnswer}
                        >
                            Kiểm tra
                        </Button>
                    ) : (
                        <Button 
                            variant="contained" 
                            color="success" 
                            size="large"
                            onClick={handleNextQuestion}
                        >
                            Câu tiếp theo
                        </Button>
                    )}
                </Box>
            </motion.div>

            {/* === SNACKBAR (THÔNG BÁO) === */}
            <Snackbar
                open={toast.open}
                autoHideDuration={2000}
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
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { generateQuiz } from '../services/gemini';
import { CheckCircle, XCircle, RefreshCw, Trophy, Loader2, ArrowRight } from 'lucide-react';

interface Props {
  topic: string;
}

const QuizView: React.FC<Props> = ({ topic }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuiz();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const loadQuiz = async () => {
    if (!topic) return;
    setLoading(true);
    setError(null);
    setCompleted(false);
    setScore(0);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);

    try {
      const data = await generateQuiz(topic);
      setQuestions(data);
    } catch (err) {
      setError("Không thể tạo bài kiểm tra lúc này. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswered(true);
    if (selectedOption === questions[currentQIndex].correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <p className="text-gray-500 animate-pulse">Đang soạn câu hỏi về "{topic}"...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={loadQuiz}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        Hãy nhập chủ đề để bắt đầu bài kiểm tra.
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
        <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Hoàn thành!</h2>
        <p className="text-gray-600 mb-6">
          Bạn trả lời đúng <span className="font-bold text-indigo-600 text-xl">{score}/{questions.length}</span> câu.
        </p>
        <div className="w-full max-w-xs bg-gray-200 rounded-full h-2.5 mb-6">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full" 
            style={{ width: `${(score / questions.length) * 100}%` }}
          ></div>
        </div>
        <button 
          onClick={loadQuiz}
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Làm bài mới</span>
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-6 flex items-center justify-between text-sm text-gray-500">
        <span>Câu hỏi {currentQIndex + 1} / {questions.length}</span>
        <span>Điểm: {score}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mb-8">
        <div 
          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" 
          style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 md:p-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
          {currentQ.question}
        </h3>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => {
            let optionClass = "w-full text-left p-4 rounded-lg border-2 transition-all flex items-center justify-between group ";
            
            if (isAnswered) {
              if (idx === currentQ.correctIndex) {
                optionClass += "border-green-500 bg-green-50 text-green-800";
              } else if (idx === selectedOption) {
                optionClass += "border-red-500 bg-red-50 text-red-800";
              } else {
                optionClass += "border-gray-100 text-gray-400 opacity-50";
              }
            } else {
              if (selectedOption === idx) {
                optionClass += "border-indigo-500 bg-indigo-50 text-indigo-900 shadow-md";
              } else {
                optionClass += "border-gray-100 hover:border-indigo-200 hover:bg-gray-50 text-gray-700";
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={isAnswered}
                className={optionClass}
              >
                <span className="font-medium">{option}</span>
                {isAnswered && idx === currentQ.correctIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
                {isAnswered && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle className="w-5 h-5 text-red-600" />}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end items-center h-12">
          {!isAnswered ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                selectedOption !== null 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Kiểm tra
            </button>
          ) : (
            <div className="flex items-center w-full justify-between animate-in fade-in slide-in-from-bottom-2">
              <div className="flex-1 mr-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="font-bold text-gray-800 block mb-1">Giải thích:</span>
                {currentQ.explanation}
              </div>
              <button
                onClick={handleNextQuestion}
                className="flex items-center space-x-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition"
              >
                <span>{currentQIndex < questions.length - 1 ? "Câu tiếp theo" : "Xem kết quả"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
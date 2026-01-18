import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelId = "gemini-3-flash-preview";

export const generateExplanation = async (topic: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Giải thích chi tiết về chủ đề: "${topic}". 
      Hãy trình bày nội dung dưới dạng bài học có cấu trúc, sử dụng Markdown (tiêu đề, danh sách, in đậm) để dễ đọc.
      Chia nhỏ các khái niệm phức tạp thành các phần dễ hiểu.
      Thêm các ví dụ thực tế nếu có thể.`,
      config: {
        systemInstruction: "Bạn là một giáo viên chuyên nghiệp, kiên nhẫn và hiểu biết sâu rộng. Hãy trả lời bằng tiếng Việt.",
      }
    });
    return response.text || "Không thể tạo nội dung. Vui lòng thử lại.";
  } catch (error) {
    console.error("Error generating explanation:", error);
    throw new Error("Lỗi kết nối đến Gemini.");
  }
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: `Tạo 5 câu hỏi trắc nghiệm về chủ đề: "${topic}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING, description: "Nội dung câu hỏi" },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING },
                description: "Danh sách 4 lựa chọn trả lời"
              },
              correctIndex: { type: Type.INTEGER, description: "Chỉ số của câu trả lời đúng (0-3)" },
              explanation: { type: Type.STRING, description: "Giải thích ngắn gọn tại sao đáp án đó đúng" }
            },
            required: ["question", "options", "correctIndex", "explanation"],
            propertyOrdering: ["question", "options", "correctIndex", "explanation"]
          }
        },
        systemInstruction: "Bạn là một người ra đề thi trắc nghiệm công tâm. Các câu hỏi cần có độ khó trung bình - khá. Trả lời bằng tiếng Việt.",
      }
    });

    const text = response.text;
    if (!text) return [];
    
    // Parse JSON
    return JSON.parse(text) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Không thể tạo bài kiểm tra.");
  }
};

export const createChatSession = (systemInstruction: string) => {
    return ai.chats.create({
        model: modelId,
        config: {
            systemInstruction,
        }
    });
}
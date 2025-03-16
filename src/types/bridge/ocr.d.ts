/**
 * OCR 관련 타입 정의
 */

type OCRDocumentType = "ID_CARD" | "DRIVER_LICENSE";

// OCR 요청 타입
interface OCRPayload {
  documentType?: OCRDocumentType;
  includeImageBase64?: boolean;
  quality?: number;
}

// OCR API 요청 타입 ( OpenAI 에 요청할 데이터 )
interface OCRRequest {
  imageUri: string;
  base64?: string;
  documentType?: OCRDocumentType;
  language?: string;
}

// 주민등록증 OCR 결과
interface IDCardOCRResult {
  name?: string;
  registrationNumber?: string;
  address?: string;
  issueDate?: string;
  issuer?: string;
  isValid?: boolean;
  confidence?: number;
}

// OCR 결과 타입
type OCRResponse = IDCardOCRResult;

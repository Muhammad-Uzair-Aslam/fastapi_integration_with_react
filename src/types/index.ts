export interface LoginResponse {
    message: string;
    data: {
      access_token: string;
      user: {
        docId: string;
        authId: string;
        status: string;
        tempPassword?: string;
        oldRankTitle?: string;
        extra_fields: Record<string, any>;
      };
    };
  }
  
  export interface ApiError {
    response?: {
      data: {
        detail: string;
      };
      status: number;
    };
  }
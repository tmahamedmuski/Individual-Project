import api from "@/lib/axios";

export interface Review {
    _id: string;
    reviewer: {
        _id: string;
        fullName: string;
        role: string;
    };
    reviewee: string;
    serviceRequest: {
        _id: string;
        serviceType: string;
    };
    rating: number;
    comment: string;
    role: string;
    createdAt: string;
}

export interface CreateReviewData {
    revieweeId: string;
    serviceRequestId: string;
    rating: number;
    comment: string;
}

export const reviewService = {
    createReview: async (data: CreateReviewData) => {
        const response = await api.post('/reviews', data);
        return response.data;
    },

    getUserReviews: async (userId: string) => {
        const response = await api.get(`/reviews/user/${userId}`);
        return response.data;
    },

    getAllReviews: async () => {
        const response = await api.get('/reviews');
        return response.data;
    }
};

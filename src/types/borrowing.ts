export type borrowing = {
    id: string;
    owner: {
        email: string;
        user_id: string;
    };
    start_date: string;
    end_date: string;
    spot_id: string;
    parking_id: number;
}
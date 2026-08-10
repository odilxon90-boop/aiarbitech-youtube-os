export interface User { id: string; email: string; role: string; createdAt: Date; }
export interface Channel { id: string; userId: string; name: string; subscribers: number; monetized: boolean; }
export interface Video { id: string; channelId: string; title: string; views: number; likes: number; comments: number; }
export interface Metric { id: string; channelId: string; date: string; views: number; subscribers: number; revenue: number; }
export interface Goal { id: string; userId: string; title: string; target: number; current: number; deadline: string | null; status: string; }
export interface WorkflowRecord { id: string; userId: string; status: string; stage: string; progress: number; }

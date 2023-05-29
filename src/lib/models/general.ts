export type AnyObject = Record<string, unknown>;
export type Fetch = (input: RequestInfo | URL, init?: RequestInit | undefined) => Promise<Response>;

export interface UserSession {
	name: string | undefined;
	email: string | undefined;
	uid: string | undefined;
}

export interface Video {
	createdAt: Date;
	fileSize: number;
	downloadUrl: string;
	name: string;
	id: string;
	uploadedBy: string;
}

export interface UserData {
	deepgramSetup?: string;
	projectId?: string;
}

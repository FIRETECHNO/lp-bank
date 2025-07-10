export interface Role {
	type: "student" | "teacher" | "parent" | "admin" | "user"
}

export interface User {
	_id: string
	name: string
	surname: string
	phone: string
	email: string
	password: string
	roles: Role[]
	// from page /about-me-form:
	gender?: string
	age?: number
}

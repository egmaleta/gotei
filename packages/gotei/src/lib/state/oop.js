export function inherits(Child, Parent) {
	Child.prototype = Object.create(Parent.prototype);
}

export function define(Class, methods) {
	Object.assign(Class.prototype, methods);
}

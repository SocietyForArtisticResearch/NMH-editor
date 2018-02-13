export class TextToolData {
	/*
	 * I think this class can probably be removed once we have a TypeScript version of RCText
	 */

	idx :number = 0;
	identity: string = '';
	textContent: string = '';

	constructor( idx: number, identity: string, initText: string ) {
		this.idx = idx;
		this.identity = identity;
		this.textContent = initText;
	}
}
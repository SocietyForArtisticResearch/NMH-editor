export class TextToolData {
	idx :number = 0;
	identity: string = '';
	textContent: string = '';

	constructor( idx: number, identity: string, initText: string ) {
		this.idx = idx;
		this.identity = identity;
		this.textContent = initText;
	}
}
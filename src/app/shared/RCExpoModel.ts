import { RCExposition, RCGrid, RCWeave } from './rcexposition';
import * as MarkdownIt from "markdown-it";

const md = new MarkdownIt('commonmark');


/** This is a class to provide MNH specific needs for RCExposition 
 * The class construct a fully specified RCExposition object 
 * (Because DI cannot call arguments on a constructor 
 * ,unless they are injected dependencies of the service module themselves).
 */
export class RCExpoModel {
    exposition: RCExposition;
    markdownInput: string;
    markdownProcessed: string;

    constructor() {
        // number of Y cells should be updated by number of tools).
        let grid = new RCGrid(1, 0, true);
        let weave = new RCWeave(grid, 'default', []);

        this.exposition = new RCExposition('myExpo', 'authors', null, [weave], 1200);
    }

    processMarkdown(input: string) {
        this.markdownInput = input;
        this.markdownProcessed = md.render(this.markdownInput);
        return this.markdownProcessed;
    }
}

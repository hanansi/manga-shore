export namespace main {
	
	export class AuthorAttributes {
	    name: string;
	
	    static createFrom(source: any = {}) {
	        return new AuthorAttributes(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	    }
	}
	export class ChapterAttributes {
	    chapter: string;
	    title: string;
	
	    static createFrom(source: any = {}) {
	        return new ChapterAttributes(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.chapter = source["chapter"];
	        this.title = source["title"];
	    }
	}
	export class Chapter {
	    id: string;
	    attributes: ChapterAttributes;
	
	    static createFrom(source: any = {}) {
	        return new Chapter(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.attributes = this.convertValues(source["attributes"], ChapterAttributes);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class ChapterImages {
	    hash: string;
	    dataSaver: string[];
	
	    static createFrom(source: any = {}) {
	        return new ChapterImages(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hash = source["hash"];
	        this.dataSaver = source["dataSaver"];
	    }
	}
	export class ChapterImagesMetadata {
	    baseUrl: string;
	    chapter: ChapterImages;
	
	    static createFrom(source: any = {}) {
	        return new ChapterImagesMetadata(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.baseUrl = source["baseUrl"];
	        this.chapter = this.convertValues(source["chapter"], ChapterImages);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class CoverArtAttributes {
	    fileName: string;
	
	    static createFrom(source: any = {}) {
	        return new CoverArtAttributes(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.fileName = source["fileName"];
	    }
	}
	export class MangaDescription {
	    en: string;
	
	    static createFrom(source: any = {}) {
	        return new MangaDescription(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.en = source["en"];
	    }
	}
	export class MangaTitle {
	    en: string;
	
	    static createFrom(source: any = {}) {
	        return new MangaTitle(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.en = source["en"];
	    }
	}
	export class MangaAttributes {
	    title: MangaTitle;
	    description: MangaDescription;
	
	    static createFrom(source: any = {}) {
	        return new MangaAttributes(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.title = this.convertValues(source["title"], MangaTitle);
	        this.description = this.convertValues(source["description"], MangaDescription);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Manga {
	    id: string;
	    attributes: MangaAttributes;
	    authors: AuthorAttributes[];
	    coverArt: CoverArtAttributes;
	
	    static createFrom(source: any = {}) {
	        return new Manga(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.attributes = this.convertValues(source["attributes"], MangaAttributes);
	        this.authors = this.convertValues(source["authors"], AuthorAttributes);
	        this.coverArt = this.convertValues(source["coverArt"], CoverArtAttributes);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	export class MangaChapters {
	    data: Chapter[];
	
	    static createFrom(source: any = {}) {
	        return new MangaChapters(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = this.convertValues(source["data"], Chapter);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class MangaData {
	    id: string;
	
	    static createFrom(source: any = {}) {
	        return new MangaData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	    }
	}
	
	export class MangaRelationships {
	    id: string;
	    type: string;
	    attributes: number[];
	
	    static createFrom(source: any = {}) {
	        return new MangaRelationships(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.type = source["type"];
	        this.attributes = source["attributes"];
	    }
	}
	
	export class SearchedMangas {
	    data: MangaData[];
	
	    static createFrom(source: any = {}) {
	        return new SearchedMangas(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = this.convertValues(source["data"], MangaData);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}


type Image = {
	smallUrl: string;
	largeUrl: string;
}

type Section = {
    name: string;
    description?: string;
    list_description?: string[];
}

export interface ProjectProps {
	project_name: string;
	company?: string;
	description?: string;
    images?:Image[];
    sections?: Section[];
}
export class ModuleModel {
    id: number;
    title: string;
    max_wrong_questions: number;
    minimun_questions: number;
    video_link: string;
    createdAt: Date;
    updatedAt: Date;
    questions: Array<object>;
    constructor(
        id: number,
        title: string,
        max_wrong_questions: number,
        minimun_questions: number,
        video_link: string,
        createdAt: Date,
        updatedAt: Date,
        questions: Array<object>
    ) {
        this.id = id;
        this.title = title;
        this.max_wrong_questions = max_wrong_questions;
        this.minimun_questions = minimun_questions;
        this.video_link = video_link;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.questions = questions;
    }
}

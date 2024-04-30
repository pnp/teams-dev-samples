import 'reflect-metadata';
import { Expose } from 'class-transformer';

export interface LearnCatalog {
    modules: Module[];
    units: ModuleUnit[];
    learningPaths: LearningPath[];
    certifications: Certification[];
    exams: Exam[];
    courses: InstructorLedCourse[];
    levels: Level[];
    roles: Role[];
    products: Product[];
    subjects: Subject[];
    modulesForPath(path: LearningPath): Module[];
}

export interface Module extends SharedModel {
    firstUnitUrl: string;
    number_of_children: number;
    units: string[];    
}

interface ModuleUnit {
    Uid: string;
    Title: string;
    duration_in_hours: number;
    Locale: string;
    last_modified: Date;
}

interface LearningPath extends SharedModel {
    FirstModuleUrl: string;
    Modules: string[];
    NumberOfModules: number;
    Title: string;
}

interface Certification {
    Uid: string;
    Title: string;
    Subtitle: string;
    icon_url: string;
    last_modified: Date;
    certification_type: string;
    Exams: string[];
    Levels: string[];
    Roles: string[];
    Products: string[];
    study_guide: StudyGuide[];
    TrackedUrl: string;
    Url: string;
}


export class Exam {    
    Uid: string;
    Title: string;
    Subtitle: string;        
    display_name: string;
    icon_url: string;
    last_modified: Date;
    pdf_download_url?: string;
    practice_test_url?: string;
    Locales: string[];
    Courses: string[];
    Levels: string[];
    Roles: string[];
    Products: string[];
    Providers: ExamProvider[];
    study_guide: StudyGuide[];
    TrackedUrl: string;
    Url: string;
}

interface InstructorLedCourse {
    Uid: string;
    CourseNumber: string;
    Title: string;
    Summary: string;
    duration_in_hours: number;
    icon_url: string;
    last_modified: Date;
    Locales: string[];
    Certification: string;
    Exam: string;
    Levels: string[];
    Roles: string[];
    Products: string[];
    study_guide: StudyGuide[];
    TrackedUrl: string;
    Url: string;
}

interface Level extends TaxonomyIdName {
    // properties of Level
}

interface Role extends TaxonomyIdName {
    // properties of Role
}

interface Product extends TaxonomyIdName {
    Children: TaxonomyIdName[];
}

interface Subject extends TaxonomyIdName {
    Children: TaxonomyIdName[];
}
interface TaxonomyIdName {
    Id: string;
    Name: string;
}

interface Rating {
    Count: number;
    Average: number;
}

type StudyGuide = {
    Title: string;
    Url: string;
}

type ExamProvider = {
    providerType: string;
    ExamUrl: string;
}
interface SharedModel {
    summary: string;
    levels: string[];
    roles: string[];
    products: string[];
    subjects: string[];
    uid: string;
    title: string;
    duration_in_minutes: number;
    rating?: Rating;
    popularity: number;
    icon_url: string;
    social_image_url: string;
    locale: string;
    last_modified: Date;    
    url: string;
}



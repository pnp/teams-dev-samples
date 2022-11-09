using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TabWithAdpativeCardFlow.Constants.Search
{
    public static class FileExtensionIcons
    {
        public const string xslx = "https://cdn0.iconfinder.com/data/icons/logos-microsoft-office-365/128/Microsoft_Office-02-64.png";
        public const string docx = "https://cdn0.iconfinder.com/data/icons/logos-microsoft-office-365/128/Microsoft_Office_Mesa_de_trabajo_1-64.png";
        public const string pptx = "https://cdn0.iconfinder.com/data/icons/logos-microsoft-office-365/128/Microsoft_Office-04-64.png";
        public const string pdf = "https://cdn4.iconfinder.com/data/icons/CS5/48/ACP_PDF%202_file_document.png";
        public const string image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC2klEQVQ4ja2U609SYRjA+Z/6D5yAXAsO56RcRAUkkUtOzWXTqSvn8kOampamJqJrXjAlE3NSkylawkrQMEFLUJGLolDmoqcDDjcGWqzO9tue9/nwO+9z2UsgUlgZJBq78H9ApCMkAomB7uQUyDz5RTdd/wJXVOwhM1A/gcLEPG/MNtgKniQwMD4NQ1OGpPxFGK3rkMXADhOExhU7qLVTsbhPOwkDuplY3Duig4VVR/rCpfUvIJQqwbTmhOYuNbR0a2Duox0EEgUsO1zpC6NY3T5AuXlwt0YBtdXFkJ0rgk97B+mXPDjxGm7VNOB9mwW5UgoRV3sMiVQMozNzUFZ179KeJgnfb2zDpPEd6E0WwHgC8K42g2flAbAxHhgsNtC9XQSz051+ya/ml6G+qRWymGiM+61PQL9gThK09T33ShTl/rXdwMXCF4Z54PDxnu0fgsnmBJN9C6zbXmDl5MV+FJd1aIYC5KvXw6xcmU9YqAzYPQephRu+Y7DhQ4nGjY+6oamr/3xQDn/4bIWGJ/xkJvZd1ToWqdTMA6tAtS+UqgKzZmvqkuMYLKv4Xn5OyPWMvAxkRWUt2sidwUWIEpPmKb3cAlmQzMCCKYUzSx9+MhBuCOWLw5bNnVjuGS4jMbET5cPRc1mc22ojMHMkQSIVOU0S9gyNh/Cr/6jrffqtqKp6l8MThx5rRo5isubhJFkcVcsYEGlo+FzoCITx6XbsU1nZ4Tb9eGRsywrazRWQ19a5iTQkcqO+59dFsigl7Tog0tGzkqP7J5KX+hChOKA2GyEqi3MmrXVT2YJQWef0n4V4eX4mhx+WVFT6htctCbJEaZ2LwuIdl3XqLxfij+JJSUNDKJUoSVpT+5WC8I/KU9xU1tgfwd/WDQKZztnjFSn8+aXle38DA+N7SXTOKUsg32QJFY4o13KLnSQ6GiJS2SJCJhVhZ9KQivRgqzMoSGX8jK9LCYmGXiHg328yTk6jlTA4BQAAAABJRU5ErkJggg==";
        public const string music = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAz0lEQVQ4je3UqwoCQRiG4VERBLHYDcpWi+I1GMVgsBrE6g2IRcSgGGxWg10EMQiLRpvXYDV5SB5eWIMss+w/YzG48LRv32HDjlJ2Twx5NDBA0jTgoI4Rtjjj+aEgibSxxsn3sk5REnwIQkbBsMgRrm3whh2GqCHz3kRNg2OUEA/ZiYOS4T/4Y8Hst8E0+ljhgIs06AQMZ0r466XQwQJ7XAOGm4Bgzh+cCk+u4u7bLHWf6Crhycq7+7qYoIWELtjUxOa6oclTVt6N3EMFEZvICwHib3W2LfNuAAAAAElFTkSuQmCC";
        public const string video = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAApUlEQVQ4jdWUQQ5GMBBG5wIILqVsJMJV/m2PaY17MJKvyWja/IxuTPIWyjzVr0r0hWqZldkfcvaYkFAjcyyey9ILmUPK9lRCK69jnzIwGeiZOfKs9V8QklWBtS5x7++M/YEBgo7Z6JrmqBFmaJbpuzTz1MJCI+zRbCA9ZQ3GJo1wRgB+1XTvJ4humxFrlmNmMZm9I3y6sX+phVKa/nAwSqlM/0N1AHGS/dFxbLpqAAAAAElFTkSuQmCC";
        public const string file = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAnUlEQVQ4jWNgAAIBMUU9fkmFNKKwuEIZn6R8JAM+ICChsEdAXOEdkL5LBH4PxP8FxWUb8Bm4n19cHrcCJABSJyAu/wdiqHwTdQyEqD8AMhQYBC1UMRDKxm4oGV6+CY8kCfmXIEOFJORqyDNQQi4YPaL4JRQ+AcPzAVkG4nQ1NBhGDRw1cNRAUgwkpYDFxBC9exAGklIF4MAgM0BmAQBWHoUNVgW0TgAAAABJRU5ErkJggg==";
        public const string code = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA60lEQVQ4jWNgGE7ADIizgZidGoaxAPE7IP4PxDnUMFAXahgIx5OicTIQfwRifzTxRCQDdaBiIDUgV0/EZVgpkqZuNLkpUPGvDBDvg0AHkvpSdMN8gfgvVPI+EIuhyR+Hyh1FEhODqv0P1esLk9AC4g9Qic9ArIdmGDPUZSD5SWhyWPVex2YLEtBjwB8hyL67xgAl8BmILUJwGXgVp7ORALYIgQGcevFFCrYIYWDAEykwgJxs2qFi+CKkkwFPsoEBUCJ9i2Qbvgjxg6rFmbCxAeQI0SZFIy6QAzUMlMXQI4QsACqqshggRdcwAQAzK14NAoTdyQAAAABJRU5ErkJggg==";
        public static string getIconByFileType(string fileExtension)
        {
            switch (fileExtension)
            {
                case "xsl":
                case "xlsx":
                    return xslx;
                case "docx":
                case "doc":
                    return docx;
                case "ppt":
                case "pptx":
                    return pptx;
                case "pdf":
                    return pdf;
                case "jpeg":
                case "png":
                case "gif":
                case "bmp":
                    return image;
                case "mpg":
                case "mpeg":
                case "mp4":
                case "wmv":
                case "avi":
                    return video;
                case "mp3":
                case "audio":
                case "wav":
                case "voc":
                    return music;
                case "js":
                case "css":
                case "ts":
                case "json":
                case "xml":
                    return code;
                default:
                    return file;
            }
        }
    }
}

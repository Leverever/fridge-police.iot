using Azure.Core;
using RS1_2024_25.API.Services.Interfaces;
using System.Threading;

namespace RS1_2024_25.API.Services
{
    public class FileHandler(IWebHostEnvironment env) : IMyFileHandler
    {
        public async Task<string> UploadFileAsync(string path, MemoryStream file, int maxFileSizeInBytes = 0, CancellationToken cancellationToken = default)
        {
            string fullPath = Path.Combine(env.ContentRootPath, path);

            string extension = ".jpg";

            string fileName = Path.GetRandomFileName() + extension;
            if (file.Length > maxFileSizeInBytes && maxFileSizeInBytes > 0 || file.Length <= 0)
            {
                return string.Empty;
            }
            using (var fs = new FileStream(Path.Combine(fullPath, fileName), FileMode.CreateNew, FileAccess.Write))
            {
                await file.CopyToAsync(fs, cancellationToken);
            }
            return fileName;
        }

        public void DeleteFile(string path)
        {
            File.Delete(path);
        }

        public async Task<Stream> GetFileAsStreamAsync(string path, CancellationToken cancellationToken = default)
        {
            Stream stream = new MemoryStream();
            using (var reader = new FileStream(Path.Combine(path),FileMode.Open,FileAccess.Read))
            {
                await reader.CopyToAsync(stream, cancellationToken);
                await reader.FlushAsync(cancellationToken);
            }
            stream.Position = 0;
            return stream;
        }

        public async Task<string> UploadFileAsync(string path, IFormFile file, int maxFileSizeInBytes = 0, CancellationToken cancellationToken = default)
        {
            string fullPath = Path.Combine(env.ContentRootPath, path);

            string extension = Path.GetExtension(file.FileName);

            DateTime date = DateTime.Now;

            string fileName = Path.GetRandomFileName()+ extension;
            if (file.Length > maxFileSizeInBytes && maxFileSizeInBytes > 0 || file.Length <= 0)
            {
                return string.Empty;
            }
            using (var fs = new FileStream(Path.Combine(fullPath, fileName), FileMode.CreateNew, FileAccess.Write))
            {
                await file.CopyToAsync(fs, cancellationToken);
            }
            return fileName;
        }
    }
}

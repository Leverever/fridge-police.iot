namespace RS1_2024_25.API.Services.Interfaces
{
    public interface IMyFileHandler
    {
        public Task<string> UploadFileAsync(string path, MemoryStream file, int maxFileSizeInBytes = 0, CancellationToken cancellationToken = default);
        public void DeleteFile(string path);
        public Task<Stream> GetFileAsStreamAsync(string path, CancellationToken cancellationToken = default);

        public Task<string> UploadFileAsync(string path, IFormFile file, int maxFileSizeInBytes = 0, CancellationToken cancellationToken = default);
    }
}

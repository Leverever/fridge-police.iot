using System.Runtime.Serialization;

namespace RS1_2024_25.API.Helper
{
    public class StringEnumHelper
    {
        public static string GetValue<T>(T someEnumValue) where T : Enum
        {
            var type = someEnumValue.GetType();
            var memberToConvert = type.GetMember(someEnumValue.ToString());
            return ((EnumMemberAttribute)memberToConvert[0].GetCustomAttributes(typeof(EnumMemberAttribute), false)[0]).Value ?? string.Empty;
        }
    }
}

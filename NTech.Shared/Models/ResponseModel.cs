using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace NTech.Shared.Models
{
    public class ResponseModel
    {
        public ResponseModel()
        {
            show_error = true;
            is_error = false;
            error_list = [];
            show_success = false;
            success_message = "Completed Successfully";
            is_exception = false;
            error_title = "An error has occured";
            show_exception = true;
        }

        public object? model { get; set; }
        public bool? show_error { get; set; }
        public bool? is_error { get; set; }
        public List<string>? error_list { get; set; }
        public string? error_title { get; set; }
        public bool? show_success { get; set; }
        public string? success_message { get; set; }
        public bool? is_exception { get; set; }
        public bool? show_exception { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Data.Models
{
    public class CategoryScore
    {
        public string CategoryName { get; set; }
        public double Score { get; set; }

        public CategoryScore(string categoryName, int score)
        {
            this.CategoryName = categoryName;
            this.Score = score;
        }
    }
}
let products = [
    { id: 1, name: "Áo sơ mi 1", price: 200000, category: "Áo sơ mi", color: "Trắng", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 2, name: "Áo sơ mi 2", price: 300000, category: "Áo sơ mi", color: "Xanh", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 3, name: "Áo sơ mi 3", price: 250000, category: "Áo sơ mi", color: "Đen", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 4, name: "Áo sơ mi 4", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 5, name: "Áo sơ mi 5", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 6, name: "Áo sơ mi 6", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 7, name: "Áo sơ mi 7", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 8, name: "Áo sơ mi 8", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 9, name: "Áo sơ mi 9", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 10, name: "Áo sơ mi 10", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 11, name: "Áo sơ mi 11", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 12, name: "Áo sơ mi 12", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 13, name: "Áo sơ mi 13", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 14, name: "Áo sơ mi 14", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 15, name: "Áo sơ mi 15", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 16, name: "Áo sơ mi 16", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 17, name: "Áo sơ mi 17", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 18, name: "Áo sơ mi 18", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 19, name: "Áo sơ mi 19", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 20, name: "Áo sơ mi 20", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 21, name: "Áo sơ mi 21", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 22, name: "Áo sơ mi 22", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 23, name: "Áo sơ mi 23", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 24, name: "Áo sơ mi 24", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 25, name: "Áo sơ mi 25", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 26, name: "Áo sơ mi 26", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 27, name: "Áo sơ mi 27", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 28, name: "Áo sơ mi 28", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 29, name: "Áo sơ mi 29", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
    { id: 30, name: "Áo sơ mi 30", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=4hp_j6OvZW0Q7kNvgEHQryJ&_nc_oc=AdgPAWwA1-KsXjt1d7jymU1uA_H13xSbr4mfceQh2r7YdsV8ovwVASYbyxfdVSPv8Kc&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=3uo0_8rHfLuN7RrqDyjvcA&oh=00_AYETCsvj24sxMK5I6X5j7lK-x9zV7Y8q50nSUYiCs0BuBw&oe=67DF7AAD" },
];

const itemPerPage = 5;
let currentPage = 1;

function displayProducts(page, listProd) {
    let start = (page - 1) * itemPerPage;
    let end = start + itemPerPage;
    let displayed = listProd.slice(start, end);

    let tbody = document.getElementById("productTableBody");
    tbody.innerHTML = "";

    displayed.forEach((product, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>
                    <img src="${product.image}" alt="${product.name}" width="50" class="me-2">
                    ${product.name}
                </td>
                <td>${product.price.toLocaleString()} VND</td>
                <td>${product.category}</td>
                <td>${product.color}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id})">Chỉnh sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">Xóa</button>
                </td>
            </tr>
        `;
    });
    updatePagination();
}

function updatePagination() {
    let totalPages = Math.ceil(products.length / itemPerPage);
    let paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    let ul = document.createElement("ul");
    ul.className = "pagination pagination-primary justify-content-center";

    // Tạo nút về trang đầu tiên nếu currentPage >= 2
    if (currentPage > 1) {
        let firstPage = createPageItem(1, `<i class="bi bi-chevron-double-left"></i>`);
        let prevPage = createPageItem(currentPage - 1, `<i class="bi bi-chevron-left"></i>`);
        ul.appendChild(firstPage);
        ul.appendChild(prevPage);
    }

    // Xác định các trang hiển thị
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        let pageItem = createPageItem(i, i);
        if (i === currentPage) {
            pageItem.classList.add("active");
        }
        ul.appendChild(pageItem);
    }

    // Tạo nút đi tới trang cuối nếu currentPage < totalPages
    if (currentPage < totalPages) {
        let nextPage = createPageItem(currentPage + 1, `<i class="bi bi-chevron-right"></i>`);
        let lastPage = createPageItem(totalPages, `<i class="bi bi-chevron-double-right"></i>`);
        ul.appendChild(nextPage);
        ul.appendChild(lastPage);
    }

    paginationContainer.appendChild(ul);
}

// Hàm tạo thẻ <li> chứa nút phân trang
function createPageItem(page, content) {
    let li = document.createElement("li");
    li.className = "page-item";
    let a = document.createElement("a");
    a.className = "page-link";
    a.innerHTML = content;
    a.href = "#";
    a.onclick = function (e) {
        e.preventDefault();
        currentPage = page;
        displayProducts(currentPage, products);
        updatePagination();
    };
    li.appendChild(a);
    return li;
}


function openModal(isEdit = false, prodId = null) {
    const modal = new bootstrap.Modal(document.getElementById("productModal"));
    document.getElementById("modalTitle").textContent = isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm";

    const realProd = products.find(i => i.id === prodId);
    console.log(realProd);

    if (isEdit && prodId !== null) {
        document.getElementById("productId").value = realProd.id;
        document.getElementById("productName").value = realProd.name;
        document.getElementById("productPrice").value = realProd.price;
        document.getElementById("productCategory").value = realProd.category;
        document.getElementById("productColor").value = realProd.color;
        document.getElementById("productImage").value = realProd.image;
        document.getElementById("previewImage").src = realProd.image;
        document.getElementById("productModal").dataset.prodId = prodId;
    } else {
        document.getElementById("productId").value = "";
        document.getElementById("productName").value = "";
        document.getElementById("productPrice").value = "";
        document.getElementById("productCategory").value = "";
        document.getElementById("productColor").value = "";
        document.getElementById("productImage").value = "";
        document.getElementById("previewImage").src = "https://via.placeholder.com/100";
        document.getElementById("productModal").dataset.prodId = "";
    }

    modal.show();
}

document.getElementById("productFile").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("previewImage").src = e.target.result;
            document.getElementById("productImage").value = e.target.result; // Lưu base64 vào input
        };
        reader.readAsDataURL(file);
    }
});

function saveProduct() {
    const id = document.getElementById("productId").value;
    const name = document.getElementById("productName").value;
    const price = document.getElementById("productPrice").value;
    const category = document.getElementById("productCategory").value;
    const color = document.getElementById("productColor").value;
    const image = document.getElementById("productImage").value;
    const prodId = document.getElementById("productModal").dataset.prodId;

    if (prodId) {
        products[prodId - 1] = { id, name, price, category, color, image };
    } else {
        const newId = products.length ? products[products.length - 1].id + 1 : 1;
        products.push({ id: newId, name, price, category, color, image });
    }

    // renderProducts();
    displayProducts(currentPage, products);
    bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
}

function editProduct(prodId) {
    openModal(true, prodId);
}

function deleteProduct(idProduct) {
    let indexToDelete = 0;
    for (; indexToDelete < products.length; indexToDelete++) {
        if (products[indexToDelete].id === idProduct) break;
    }

    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        products.splice(indexToDelete, 1);
        // renderProducts();
        displayProducts(currentPage, products);
    }
}

function filterProducts() {
    console.log("Check filter")
    const category = document.getElementById("filterCategory").value;
    const color = document.getElementById("filterColor").value;
    const maxPrice = document.getElementById("filterPrice").value;

    let filteredProducts = products.filter(i => {
        return (category === "" || i.category === category)
            && (color === "" || i.color === color)
            && (maxPrice === "" || i.price <= parseInt(maxPrice));
    })

    displayProducts(1, filterProducts);
}

document.addEventListener("DOMContentLoaded", displayProducts(1, products));
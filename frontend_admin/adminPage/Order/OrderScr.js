let products = [
    { id: 1, name: "Áo sơ mi 1", price: 200000, category: "Áo sơ mi", color: "Trắng", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 2, name: "Áo sơ mi 2", price: 300000, category: "Áo sơ mi", color: "Xanh", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 3, name: "Áo sơ mi 3", price: 250000, category: "Áo sơ mi", color: "Đen", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 4, name: "Áo sơ mi 4", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 5, name: "Áo sơ mi 5", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 6, name: "Áo sơ mi 6", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 7, name: "Áo sơ mi 7", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 8, name: "Áo sơ mi 8", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 9, name: "Áo sơ mi 9", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 10, name: "Áo sơ mi 10", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 11, name: "Áo sơ mi 11", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 12, name: "Áo sơ mi 12", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 13, name: "Áo sơ mi 13", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 14, name: "Áo sơ mi 14", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 15, name: "Áo sơ mi 15", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 16, name: "Áo sơ mi 16", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 17, name: "Áo sơ mi 17", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 18, name: "Áo sơ mi 18", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 19, name: "Áo sơ mi 19", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 20, name: "Áo sơ mi 20", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 21, name: "Áo sơ mi 21", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 22, name: "Áo sơ mi 22", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 23, name: "Áo sơ mi 23", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 24, name: "Áo sơ mi 24", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 25, name: "Áo sơ mi 25", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 26, name: "Áo sơ mi 26", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 27, name: "Áo sơ mi 27", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 28, name: "Áo sơ mi 28", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 29, name: "Áo sơ mi 29", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
    { id: 30, name: "Áo sơ mi 30", price: 280000, category: "Áo sơ mi", color: "Đỏ", image: "https://scontent.fsgn19-1.fna.fbcdn.net/v/t39.30808-6/480668186_599758586385744_1799366260596043_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=CMEIi5Ley4UQ7kNvgFPVemu&_nc_oc=AdkCGwnXDNcoS_aALCK-Lo_cx0UshppO9TWoVQgvOx5ZvLKA7Gv1kaHajrppW3NC0Vo&_nc_zt=23&_nc_ht=scontent.fsgn19-1.fna&_nc_gid=qtPEfRvA_uSMU4QZAIiWnA&oh=00_AYGmBfowPhzVbfTE1abk4uvV12P3v8X9KsaNoXhRrvoORg&oe=67E6F32D" },
];

let orders = [
    {
        orderId: 1,
        products: [
            { ...products[0], quantity: 2, size: "M" },
            { ...products[1], quantity: 1, size: "L" },
            { ...products[2], quantity: 3, size: "S" }
        ],
        customer: {
            cus_name: "Nguyen Quoc Dat",
            phone_num: "0393943968",
            addr: "Dong Hoa, Di An, Binh Duong"
        },
        status: "Dangling"
    },
    {
        orderId: 2,
        products: [
            { ...products[3], quantity: 1, size: "M" },
            { ...products[4], quantity: 2, size: "L" },
            { ...products[5], quantity: 1, size: "S" }
        ],
        customer: {
            cus_name: "Nguyen Quoc Dat",
            phone_num: "0393943968",
            addr: "Dong Hoa, Di An, Binh Duong"
        },
        status: "Dangling"
    },
    {
        orderId: 3,
        products: [
            { ...products[6], quantity: 2, size: "S" },
            { ...products[7], quantity: 1, size: "M" },
            { ...products[8], quantity: 2, size: "L" }
        ],
        customer: {
            cus_name: "Nguyen Quoc Dat",
            phone_num: "0393943968",
            addr: "Dong Hoa, Di An, Binh Duong"
        },
        status: "Dangling"
    },
    {
        orderId: 4,
        products: [
            { ...products[9], quantity: 1, size: "M" },
            { ...products[10], quantity: 1, size: "L" },
            { ...products[11], quantity: 2, size: "S" }
        ],
        customer: {
            cus_name: "Nguyen Quoc Dat",
            phone_num: "0393943968",
            addr: "Dong Hoa, Di An, Binh Duong"
        },
        status: "Dangling"
    },
    {
        orderId: 5,
        products: [
            { ...products[12], quantity: 2, size: "M" },
            { ...products[13], quantity: 2, size: "L" },
            { ...products[14], quantity: 1, size: "XL" }
        ],
        customer: {
            cus_name: "Nguyen Quoc Dat",
            phone_num: "0393943968",
            addr: "Dong Hoa, Di An, Binh Duong"
        },
        status: "Dangling"
    },
    {
        orderId: 6,
        products: [
            { ...products[15], quantity: 1, size: "M" },
            { ...products[16], quantity: 3, size: "L" },
            { ...products[17], quantity: 1, size: "S" }
        ],
        customer: {
            cus_name: "Nguyen Quoc Dat",
            phone_num: "0393943968",
            addr: "Dong Hoa, Di An, Binh Duong"
        },
        status: "Dangling"
    },
    {
        orderId: 7,
        products: [
            { ...products[18], quantity: 2, size: "M" },
            { ...products[19], quantity: 1, size: "L" },
            { ...products[20], quantity: 1, size: "S" }
        ],
        customer: {
            cus_name: "Nguyen Quoc Dat",
            phone_num: "0393943968",
            addr: "Dong Hoa, Di An, Binh Duong"
        },
        status: "Dangling"
    },
    {
        orderId: 8,
        products: [
            { ...products[21], quantity: 1, size: "M" },
            { ...products[22], quantity: 2, size: "L" },
            { ...products[23], quantity: 1, size: "S" }
        ],
        customer: {
            cus_name: "Nguyen Quoc Dat",
            phone_num: "0393943968",
            addr: "Dong Hoa, Di An, Binh Duong"
        },
        status: "Dangling"
    },
    {
        orderId: 9,
        products: [
            { ...products[24], quantity: 1, size: "M" },
            { ...products[25], quantity: 1, size: "L" },
            { ...products[26], quantity: 2, size: "S" }
        ],
        customer: {
            cus_name: "Nguyen Quoc Dat",
            phone_num: "0393943968",
            addr: "Dong Hoa, Di An, Binh Duong"
        },
        status: "Dangling"
    },
    {
        orderId: 10,
        products: [
            { ...products[27], quantity: 2, size: "M" },
            { ...products[28], quantity: 2, size: "L" },
            { ...products[29], quantity: 1, size: "S" }
        ],
        customer: {
            cus_name: "Nguyen Quoc Dat",
            phone_num: "0393943968",
            addr: "Dong Hoa, Di An, Binh Duong"
        },
        status: "Dangling"
    }
];


const itemPerPage = 5;
let currentPage = 1;

function displayOrders(page, listOrder) {
    let start = (page - 1) * itemPerPage;
    let end = start + itemPerPage;
    let displayedOrders = listOrder.slice(start, end);

    let tbody = document.getElementById("orderTableBody");
    tbody.innerHTML = "";

    displayedOrders.forEach(order => {
        // Tổng tiền tính theo số lượng của từng sản phẩm
        let totalPrice = order.products.reduce((sum, product) => {
            return sum + product.price * (product.quantity || 1);
        }, 0);

        // Hiển thị thông tin sản phẩm, bao gồm số lượng và size
        let productsHTML = order.products.map(product => `
            <div class="d-flex flex-row align-items-center mb-2">
                <img src="${product.image}" alt="${product.name}" width="50" class="me-2 d-none d-md-block">
                <div class="d-flex flex-column flex-xl-row justify-content-xl-around align-items-start w-100">
                    <div class="mr-2">${product.name}</div>
                    <div class="mr-4"> Số lượng: ${product.quantity} - Size: ${product.size}</div>
                    <div>${(product.price).toLocaleString()} VND</div>
                </div>
            </div>
        `).join("");

        let customer_info = `
            <div class="d-flex flex-column justify-content-around h-100 ">
                <div class="mb-2">Họ và tên: ${order.customer.cus_name}</div>
                <div class="mb-2">Số điện thoại: ${order.customer.phone_num}</div>
                <div>Địa chỉ giao hàng: ${order.customer.addr}</div>
            </div>
        `;


        // Xác định phần hiển thị theo trạng thái đơn hàng
        let actionHTML = "";
        if (order.status === "Dangling") {
            actionHTML = `
                <div class="d-flex flex-column align-items-center">
                    <button class="btn btn-success btn-sm w-75" onclick="approveOrder(${order.orderId})">Duyệt đơn hàng</button>
                    <button class="btn btn-danger btn-sm mt-2 w-75" onclick="deleteOrder(${order.orderId})">Hủy đơn hàng</button>
                </div>   
            `;
        } else if (order.status === "Approved") {
            actionHTML = `<span class="text-success fw-bold text-center d-block">Đã duyệt</span>`;
        } else if (order.status === "Declined") {
            actionHTML = `<span class="text-danger fw-bold text-center d-block">Đã hủy</span>`;
        }

        tbody.innerHTML += `
            <tr class="text-sm">
                <td class="text-center">#${order.orderId}</td>
                <td>
                    ${productsHTML}
                    <div class="mt-2">
                        <strong>Tổng: ${totalPrice.toLocaleString()} VND</strong>
                    </div>
                </td>
                <td>${customer_info}</td>
                <td>${actionHTML}</td>
            </tr>
        `;
    });

    updatePagination();
}





function updatePagination() {
    let totalPages = Math.ceil(orders.length / itemPerPage);
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
        displayOrders(currentPage, orders);
        updatePagination();
    };
    li.appendChild(a);
    return li;
}

let selectedOrderId = null;
let selectedAction = null;

function showModal(title, message, action) {
    selectedAction = action;
    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalMessage").innerText = message;

    let modal = new bootstrap.Modal(document.getElementById("confirmModal"));
    modal.show()
}

function approveOrder(orderId) {
    selectedOrderId = orderId;
    showModal(
        "Xác nhận duyệt đơn",
        `Bạn có chắc chắn muốn duyệt đơn hàng #${orderId} không? `,
        "approve"
    );
}

function deleteOrder(orderId) {
    selectedOrderId = orderId;
    showModal(
        "Xác nhận hủy đơn",
        `Bạn có chắc chắn muốn hủy đơn hàng #${orderId} không? `,
        "decline"
    );
}

document.getElementById("confirmAction").addEventListener("click", function () {
    if (selectedOrderId !== null) {
        if (selectedAction === "approve") {
            let orderIndex = orders.findIndex(order => order.orderId === selectedOrderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = "Approved";
            }
        }
        else if (selectedAction === "decline") {
            // orders = orders.filter(order => order.orderId !== selectedOrderId);
            let orderIndex = orders.findIndex(order => order.orderId === selectedOrderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = "Declined";
            }
        }

        selectedOrderId = null;
        selectedAction = null;
        displayOrders(currentPage, orders);

        let modal = bootstrap.Modal.getInstance(document.getElementById("confirmModal"));
        modal.hide();
    }
})

document.addEventListener("DOMContentLoaded", displayOrders(1, orders));
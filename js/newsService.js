var NewsService = (function () {
  var articles = {
    politics: [
      {
        title: 'New Senate Bill Proposes Significant Healthcare Reform',
        description: 'Lawmakers gathered today to discuss the implications of the newly introduced healthcare legislation.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJaJpAbvJcGg33z6vJK5ioeDf8UR1K1htuRib7qSulmSlyPNYra58VXVjhl9SHCoFs8ePpIfWTI436P7L2J49AO7JgTuoLSKZAwlfa4UMRJK7TYrRDcx-BUtrQHo-LfAKJK9WKK4M0uox7TfjKzSkzi9smsQzRQqnHfpuaCLyHDHEOqfuScDngef4BsK-jAs3K7ZBJtu9Ojbwa1IudKni134SColHZVfrtRVTheWWAZqyrVZG8vlHx72T4WI_k23P0Pzf09bJxKBE'
      },
      {
        title: 'Election 2024: Key Battleground States Update',
        description: 'Latest polling data suggests a tightening race in critical swing states.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq5vZBw0wIc96zTcT9tWT6G_CBFrwh-dIcndGx86jkRgH6watfYgtHu6W7iO0rAm73e9_aDtewQ_eKT1JUdADsWgH7Lq0rfvxESSzEK0SZdEd4zMokTrwPl2rjyFV3b3AVwm0gk9mkgo0i8RvvBZ99g5ms_-7b5q8xU9Or1YDXSwdRHs9eklsZjVCGQVcaHM75mzz3pq2QGkQykBD9F9i6PIKriCCjiDG8DuCwSXThREAtaqP1FN6SmrmOZ7ii_pFrPX4TYPd7Dqk'
      },
      {
        title: 'International Summit Reaches Historic Carbon Agreement',
        description: 'Global leaders signed a pact to accelerate renewable energy.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf49xr3eLH0x1SfJ15XfIoZjs-4r3ieiItFlHATwrcHKCC5uxv7M0dLXcYtEaRVtLvtaqzYtnQiw63jvQ-N4Itsa3wsklGkvULri2GXeATlwIcClS36KDzZ6xW7Wn2jymRthHMGrEEBgeRGoWtJjBj5c0UocpurMRz97Tk5ECjIHcpuNwybbAX4j9OL-4HDuHw-xbQW3i3Jr_B9RxEbaWqqAUVVOR1Bi4REmOP0L-4vqBTBmBrw-szwFQIQEuWNTaL1EFp_l2yqD4'
      }
    ],
    economy: [
      {
        title: 'Federal Reserve Signals Potential Rate Cut in Coming Months',
        description: 'Markets rally as central bank hints at easing monetary policy amid cooling inflation.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJaJpAbvJcGg33z6vJK5ioeDf8UR1K1htuRib7qSulmSlyPNYra58VXVjhl9SHCoFs8ePpIfWTI436P7L2J49AO7JgTuoLSKZAwlfa4UMRJK7TYrRDcx-BUtrQHo-LfAKJK9WKK4M0uox7TfjKzSkzi9smsQzRQqnHfpuaCLyHDHEOqfuScDngef4BsK-jAs3K7ZBJtu9Ojbwa1IudKni134SColHZVfrtRVTheWWAZqyrVZG8vlHx72T4WI_k23P0Pzf09bJxKBE'
      },
      {
        title: 'Tech Giants Report Record Quarterly Earnings',
        description: 'Major technology companies exceed analyst expectations as AI investments pay off.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq5vZBw0wIc96zTcT9tWT6G_CBFrwh-dIcndGx86jkRgH6watfYgtHu6W7iO0rAm73e9_aDtewQ_eKT1JUdADsWgH7Lq0rfvxESSzEK0SZdEd4zMokTrwPl2rjyFV3b3AVwm0gk9mkgo0i8RvvBZ99g5ms_-7b5q8xU9Or1YDXSwdRHs9eklsZjVCGQVcaHM75mzz3pq2QGkQykBD9F9i6PIKriCCjiDG8DuCwSXThREAtaqP1FN6SmrmOZ7ii_pFrPX4TYPd7Dqk'
      },
      {
        title: 'Global Supply Chain Recovery Accelerates',
        description: 'Shipping costs stabilize as ports clear backlogs and trade flows normalize.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf49xr3eLH0x1SfJ15XfIoZjs-4r3ieiItFlHATwrcHKCC5uxv7M0dLXcYtEaRVtLvtaqzYtnQiw63jvQ-N4Itsa3wsklGkvULri2GXeATlwIcClS36KDzZ6xW7Wn2jymRthHMGrEEBgeRGoWtJjBj5c0UocpurMRz97Tk5ECjIHcpuNwybbAX4j9OL-4HDuHw-xbQW3i3Jr_B9RxEbaWqqAUVVOR1Bi4REmOP0L-4vqBTBmBrw-szwFQIQEuWNTaL1EFp_l2yqD4'
      }
    ],
    entertainment: [
      {
        title: 'Award Season Kicks Off with Stunning Performances',
        description: 'This year\'s nominees showcase diverse storytelling from around the world.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJaJpAbvJcGg33z6vJK5ioeDf8UR1K1htuRib7qSulmSlyPNYra58VXVjhl9SHCoFs8ePpIfWTI436P7L2J49AO7JgTuoLSKZAwlfa4UMRJK7TYrRDcx-BUtrQHo-LfAKJK9WKK4M0uox7TfjKzSkzi9smsQzRQqnHfpuaCLyHDHEOqfuScDngef4BsK-jAs3K7ZBJtu9Ojbwa1IudKni134SColHZVfrtRVTheWWAZqyrVZG8vlHx72T4WI_k23P0Pzf09bJxKBE'
      },
      {
        title: 'Streaming Wars Heat Up with New Platform Launch',
        description: 'Competition intensifies as another major player enters the streaming market.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq5vZBw0wIc96zTcT9tWT6G_CBFrwh-dIcndGx86jkRgH6watfYgtHu6W7iO0rAm73e9_aDtewQ_eKT1JUdADsWgH7Lq0rfvxESSzEK0SZdEd4zMokTrwPl2rjyFV3b3AVwm0gk9mkgo0i8RvvBZ99g5ms_-7b5q8xU9Or1YDXSwdRHs9eklsZjVCGQVcaHM75mzz3pq2QGkQykBD9F9i6PIKriCCjiDG8DuCwSXThREAtaqP1FN6SmrmOZ7ii_pFrPX4TYPd7Dqk'
      },
      {
        title: 'Music Festival Lineup Announced for Summer 2024',
        description: 'A star-studded lineup promises an unforgettable festival experience.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf49xr3eLH0x1SfJ15XfIoZjs-4r3ieiItFlHATwrcHKCC5uxv7M0dLXcYtEaRVtLvtaqzYtnQiw63jvQ-N4Itsa3wsklGkvULri2GXeATlwIcClS36KDzZ6xW7Wn2jymRthHMGrEEBgeRGoWtJjBj5c0UocpurMRz97Tk5ECjIHcpuNwybbAX4j9OL-4HDuHw-xbQW3i3Jr_B9RxEbaWqqAUVVOR1Bi4REmOP0L-4vqBTBmBrw-szwFQIQEuWNTaL1EFp_l2yqD4'
      }
    ],
    sports: [
      {
        title: 'Champions League Quarter-Finals Draw Revealed',
        description: 'Exciting matchups await as Europe\'s top clubs prepare for knockout rounds.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJaJpAbvJcGg33z6vJK5ioeDf8UR1K1htuRib7qSulmSlyPNYra58VXVjhl9SHCoFs8ePpIfWTI436P7L2J49AO7JgTuoLSKZAwlfa4UMRJK7TYrRDcx-BUtrQHo-LfAKJK9WKK4M0uox7TfjKzSkzi9smsQzRQqnHfpuaCLyHDHEOqfuScDngef4BsK-jAs3K7ZBJtu9Ojbwa1IudKni134SColHZVfrtRVTheWWAZqyrVZG8vlHx72T4WI_k23P0Pzf09bJxKBE'
      },
      {
        title: 'Transfer Window: Top Deals and Rumored Moves',
        description: 'Club spending reaches new heights as deadline day approaches.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq5vZBw0wIc96zTcT9tWT6G_CBFrwh-dIcndGx86jkRgH6watfYgtHu6W7iO0rAm73e9_aDtewQ_eKT1JUdADsWgH7Lq0rfvxESSzEK0SZdEd4zMokTrwPl2rjyFV3b3AVwm0gk9mkgo0i8RvvBZ99g5ms_-7b5q8xU9Or1YDXSwdRHs9eklsZjVCGQVcaHM75mzz3pq2QGkQykBD9F9i6PIKriCCjiDG8DuCwSXThREAtaqP1FN6SmrmOZ7ii_pFrPX4TYPd7Dqk'
      },
      {
        title: 'World Cup Qualifying: Nations Battle for Spots',
        description: 'The road to the World Cup intensifies with crucial qualifying matches.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf49xr3eLH0x1SfJ15XfIoZjs-4r3ieiItFlHATwrcHKCC5uxv7M0dLXcYtEaRVtLvtaqzYtnQiw63jvQ-N4Itsa3wsklGkvULri2GXeATlwIcClS36KDzZ6xW7Wn2jymRthHMGrEEBgeRGoWtJjBj5c0UocpurMRz97Tk5ECjIHcpuNwybbAX4j9OL-4HDuHw-xbQW3i3Jr_B9RxEbaWqqAUVVOR1Bi4REmOP0L-4vqBTBmBrw-szwFQIQEuWNTaL1EFp_l2yqD4'
      }
    ]
  };

  return {
    getArticles: function (category) {
      return articles[category] || [];
    },
    getAllCategories: function () {
      return Object.keys(articles);
    }
  };
})();

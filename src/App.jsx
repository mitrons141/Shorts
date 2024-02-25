import React, { useRef, useEffect, useState } from 'react';

const App = () => {
  const videos = [
    'video1.mp4',
    'video2.mp4',
    'video3.mp4',
    // Add more video files here
  ];

  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(Array(videos.length).fill(false));
  const [likedVideos, setLikedVideos] = useState(Array(videos.length).fill(false));

  const handlePlay = (index) => {
    const newIsPlaying = [...isPlaying];
    newIsPlaying[index] = true;
    setIsPlaying(newIsPlaying);
  };

  const handleLike = (index) => {
    const newLikedVideos = [...likedVideos];
    newLikedVideos[index] = !newLikedVideos[index];
    setLikedVideos(newLikedVideos);
  };

  const videoRefs = useRef(videos.map(() => React.createRef()));

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5, // Play when 50% of the video is in view
    };

    const callback = (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting && !isPlaying[index]) {
          videoRefs.current[index].current.play();
          handlePlay(index);
        } else if (!entry.isIntersecting && isPlaying[index]) {
          videoRefs.current[index].current.pause();
          setIsPlaying((prevIsPlaying) => {
            const newIsPlaying = [...prevIsPlaying];
            newIsPlaying[index] = false;
            return newIsPlaying;
          });
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);

    videoRefs.current.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [videos, isPlaying]);

  return (
    <>
      <form className="max-w-lg mx-auto pb-6 pt-2">
        <div className="relative">
          <input
            type="search"
            id="default-search"
            placeholder="Search"
            className="block w-full p-4 ps-10 text-sm text-white rounded-full bg-gray-800 focus:outline-none focus:ring focus:ring-blue-500 placeholder:text-lg"
            required
          />
          <div className="border-l-2 absolute inset-y-0 end-12 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
        </div>
      </form>
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col gap-32">
          {videos.map((video, index) => (
            <div key={index} className="relative">
              <video
                src={`/${video}`}
                controls
                muted
                ref={videoRefs.current[index]}
                className="w-full h-[50rem] object-fit: cover rounded-xl"
              />
              <button
                className="absolute top-2 right-2 p-2 rounded-full bg-gray-700 dark:bg-gray-300"
                onClick={() => handleLike(index)}
                style={{ backgroundColor: likedVideos[index] ? 'darkgray' : 'gray' }}
              >
                <svg
                  className="w-6 h-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21l-1.45-1.32C5.4 16.12 2 12.52 2 9.05c0-3.31 2.69-6 6-6 2.15 0 4.09 1.12 5.19 2.81L12 9.64l1.81-2.47c1.1-1.5 3.04-2.61 5.19-2.61 3.31 0 6 2.69 6 6 0 3.47-3.4 7.07-8.55 10.63L12 21z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className='p-4'></div>
    </>
  );
};

export default App;

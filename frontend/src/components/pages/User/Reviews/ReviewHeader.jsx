const ReviewHeader = ({ onAddReview }) => (
  <div className="relative h-[40vh] flex items-center justify-center bg-blue-900 text-white">
    <img 
      src="https://images.unsplash.com/photo-1469474968028-56623f02e42e" 
      className="absolute inset-0 w-full h-full object-cover opacity-50"
      alt="Travel background"
    />
    <div className="relative z-10 text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Traveler Stories</h1>
      <p className="text-lg opacity-90 mb-6">Real experiences from our global community</p>
      <button 
        onClick={onAddReview}
        className="bg-emerald-500 hover:bg-emerald-600 transition-all px-8 py-3 rounded-full font-semibold shadow-lg"
      >
        Write a Review
      </button>
    </div>
  </div>
);

export default ReviewHeader;
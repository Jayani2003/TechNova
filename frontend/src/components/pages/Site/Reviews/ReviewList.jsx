const ReviewList = () => {
  // Mock data representing reviews that have been APPROVED by admin
  const approvedReviews = [
    { id: 1, name: "Sarah J.", rating: 5, comment: "The safari tour was breathtaking! Everything was perfectly timed.", date: "Oct 12, 2025" },
    { id: 2, name: "Marc K.", rating: 4, comment: "Excellent vehicle quality. The SUV was clean and the driver was professional.", date: "Nov 05, 2025" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {approvedReviews.map((rev) => (
        <div key={rev.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div className="flex text-yellow-400 mb-2">
            {[...Array(rev.rating)].map((_, i) => <span key={i}>★</span>)}
          </div>
          <p className="text-slate-600 italic mb-4">"{rev.comment}"</p>
          <div className="flex justify-between items-center border-t pt-4">
            <span className="font-bold text-slate-800">{rev.name}</span>
            <span className="text-xs text-slate-400">{rev.date}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
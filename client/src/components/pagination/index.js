export default function Pagination(props) {
    return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        {/* <div className="flex flex-1 justify-between sm:hidden">
            <button
                className="flex mx-2 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => props.setPage(props.page - 1)}
                disabled={props.page === 1}    
            >
                Previous
            </button>
                <span className="mx-4 text-gray-700">{props.page}</span>
            <button
                className="flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => props.setPage(props.page + 1)}
                disabled={props.page === props.totalPages}
            >
                Next          
            </button>
        </div> */}
        <div className="flex sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div className="flex p-2">
                <p className="text-sm text-gray-700">
                    Showing
                    <span className="mx-1 font-medium">{props.currentPage === 1 ? props.currentPage : (props.currentPage - 1) * props.pageSize}</span>
                    to
                    <span className="mx-1 font-medium">{props.currentPage * props.pageSize < props.totalFiles ? props.currentPage * props.pageSize : props.totalFiles}</span>
                    of
                    <span className="mx-1 font-medium">{props.totalFiles}</span>
                    results
                </p>
            </div>
            <div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-xs" aria-label="Pagination">
                    <button
                        className="flex mx-2 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={() => props.setPage(props.currentPage - 1)}
                        disabled={props.currentPage === 1}    
                    >
                        Previous
                    </button>
                    {/* <span className="mx-4 px-4 py-2 bg-gray-500 text-gray-700">{props.currentPage}</span> */}
                    <button
                        className="flex mx-2 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        onClick={() => props.setPage(props.currentPage + 1)}
                        disabled={props.currentPage === props.totalPages}
                    >
                        Next          
                    </button>
                </nav>
            </div>
        </div>
    </div>
    );
  }

 
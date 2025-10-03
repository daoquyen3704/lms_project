import React, { useState, useEffect, useMemo } from 'react';
import Course from '../common/Course';
import Layout from '../common/Layout';
import { apiUrl } from '../common/Config';
import { fetchJWT } from '../../utils/fetchJWT';
import toast from 'react-hot-toast';
import debounce from 'lodash.debounce';


const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedLevels, setSelectedLevels] = useState([]);
    const [selectedLanguages, setSelectedLanguages] = useState([]);
    const [sortBy, setSortBy] = useState('newest');
    const [totalFound, setTotalFound] = useState(null);
    const [pagination, setPagination] = useState({});


    // Map FE sort to backend sort_by/sort_order
    const appendSortParams = (params) => {
        if (sortBy === 'newest') {
            params.append('sort_by', 'created_at');
            params.append('sort_order', 'desc');
        } else if (sortBy === 'oldest') {
            params.append('sort_by', 'created_at');
            params.append('sort_order', 'asc');
        } else if (sortBy === 'price_low') {
            params.append('sort_by', 'price');
            params.append('sort_order', 'asc');
        } else if (sortBy === 'price_high') {
            params.append('sort_by', 'price');
            params.append('sort_order', 'desc');
        }
    };

    const fetchPage = (page) => {
        searchCourses(searchKeyword, page);
    };
    // Single API function for searching courses
    const searchCourses = async (keywordValue = '', page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (keywordValue) params.append('keyword', keywordValue);
            if (selectedCategories.length) params.append('category', selectedCategories.join(','));
            if (selectedLevels.length) params.append('level', selectedLevels.join(','));
            if (selectedLanguages.length) params.append('language', selectedLanguages.join(','));
            appendSortParams(params);
            params.append('page', page);

            const res = await fetchJWT(`${apiUrl}/search?${params.toString()}`, { method: 'GET' });
            const result = await res.json();

            if (res.ok && result.status === 200) {
                // If backend returns meta like in your controller, capture it
                if (result.meta) setTotalFound(result.meta.total ?? null);
                setCourses(result.data || []);
                setPagination(result.meta || {});
            } else {
                toast.error(result.message || 'Failed to search courses');
            }
        } catch (error) {
            console.error('Error searching courses:', error);
            toast.error('Failed to search courses');
        } finally {
            setLoading(false);
        }
    };

    // Debounced search for typing in input
    const debouncedSearch = useMemo(
        () =>
            debounce((kw) => {
                searchCourses(kw);
            }, 500),
        // Recreate when filters/sort change so typing re-applies latest filters
        [selectedCategories, selectedLevels, selectedLanguages, sortBy]
    );

    // cleanup debounce on unmount
    useEffect(() => {
        return () => debouncedSearch.cancel();
    }, [debouncedSearch]);

    // Search input change
    const handleSearch = (e) => {
        const keyword = e.target.value;
        setSearchKeyword(keyword);
        debouncedSearch(keyword);
    };

    // Category/Level/Language toggles
    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prev) => (prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]));
    };
    const handleLevelChange = (levelId) => {
        setSelectedLevels((prev) => (prev.includes(levelId) ? prev.filter((id) => id !== levelId) : [...prev, levelId]));
    };
    const handleLanguageChange = (languageId) => {
        setSelectedLanguages((prev) => (prev.includes(languageId) ? prev.filter((id) => id !== languageId) : [...prev, languageId]));
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const clearFilters = (e) => {
        e?.preventDefault();
        setSearchKeyword('');
        setSelectedCategories([]);
        setSelectedLevels([]);
        setSelectedLanguages([]);
        setSortBy('newest');
        searchCourses(''); // reload all
    };

    // Load filter lists + initial courses
    useEffect(() => {
        const loadStatic = async () => {
            try {
                const [cRes, lRes, langRes] = await Promise.all([
                    fetchJWT(`${apiUrl}/fetch-categories`, { method: 'GET' }),
                    fetchJWT(`${apiUrl}/fetch-levels`, { method: 'GET' }),
                    fetchJWT(`${apiUrl}/fetch-languages`, { method: 'GET' }),
                ]);
                const [cJson, lJson, langJson] = await Promise.all([cRes.json(), lRes.json(), langRes.json()]);
                if (cRes.ok && cJson.status === 200) setCategories(cJson.data || []);
                if (lRes.ok && lJson.status === 200) setLevels(lJson.data || []);
                if (langRes.ok && langJson.status === 200) setLanguages(langJson.data || []);
            } catch (e) {
                console.error('Error fetching filters:', e);
            }
            // initial
            searchCourses('');
        };
        loadStatic();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Re-run search when filters or sort change (respecting current keyword)
    useEffect(() => {
        searchCourses(searchKeyword);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategories, selectedLevels, selectedLanguages, sortBy]);

    return (
        <Layout>
            <div className="container pb-5 pt-3">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="#">Home</a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            Courses
                        </li>
                    </ol>
                </nav>

                <div className="row">
                    <div className="col-lg-3">
                        <div className="sidebar mb-5 card border-0">
                            <div className="card-body shadow">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by keyword"
                                    value={searchKeyword}
                                    onChange={handleSearch}
                                />

                                <div className="pt-3">
                                    <h3 className="h5 mb-2">Category</h3>
                                    <ul>
                                        {categories.map((category) => (
                                            <li key={category.id}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={category.id}
                                                        id={`category-${category.id}`}
                                                        checked={selectedCategories.includes(category.id)}
                                                        onChange={() => handleCategoryChange(category.id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`category-${category.id}`}>
                                                        {category.name}
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-3">
                                    <h3 className="h5  mb-2">Level</h3>
                                    <ul>
                                        {levels.map((level) => (
                                            <li key={level.id}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={level.id}
                                                        id={`level-${level.id}`}
                                                        checked={selectedLevels.includes(level.id)}
                                                        onChange={() => handleLevelChange(level.id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`level-${level.id}`}>
                                                        {level.name}
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mb-3">
                                    <h3 className="h5 mb-2">Language</h3>
                                    <ul>
                                        {languages.map((language) => (
                                            <li key={language.id}>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        value={language.id}
                                                        id={`language-${language.id}`}
                                                        checked={selectedLanguages.includes(language.id)}
                                                        onChange={() => handleLanguageChange(language.id)}
                                                    />
                                                    <label className="form-check-label" htmlFor={`language-${language.id}`}>
                                                        {language.name}
                                                    </label>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button className="btn btn-link p-0 clear-filter" onClick={clearFilters}>
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9">
                        <section className="section-3">
                            <div className="d-flex justify-content-between mb-3 align-items-center">
                                <div className="h5 mb-0">{totalFound !== null ? `${totalFound} courses found` : null}</div>
                                <div>
                                    <select className="form-select" value={sortBy} onChange={handleSortChange}>
                                        <option value="newest">Newest First</option>
                                        <option value="oldest">Oldest First</option>
                                        <option value="price_low">Price: Low to High</option>
                                        <option value="price_high">Price: High to Low</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row gy-4">
                                {loading ? (
                                    <div className="text-center">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : courses.length > 0 ? (
                                    courses.map((course) => <Course key={course.id} course={course} customClasses="col-lg-4 col-md-6" />)
                                ) : (
                                    <div className="text-center">
                                        <p>No courses found</p>
                                    </div>
                                )}
                            </div>

                            {pagination.total > 0 && (
                                <nav className="mt-4">
                                    <ul className="pagination justify-content-center">
                                        {/* Previous */}
                                        <li className={`page-item ${pagination.current_page === 1 ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => fetchPage(pagination.current_page - 1)}
                                                disabled={pagination.current_page === 1}
                                            >
                                                «
                                            </button>
                                        </li>

                                        {/* Page numbers với rút gọn */}
                                        {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                                            .filter(page =>
                                                page === 1 ||
                                                page === pagination.last_page ||
                                                (page >= pagination.current_page - 1 && page <= pagination.current_page + 1)
                                            )
                                            .map((page, index, array) => (
                                                <React.Fragment key={page}>
                                                    {index > 0 && array[index - 1] !== page - 1 && (
                                                        <li className="page-item disabled">
                                                            <span className="page-link">…</span>
                                                        </li>
                                                    )}
                                                    <li className={`page-item ${pagination.current_page === page ? 'active' : ''}`}>
                                                        <button className="page-link" onClick={() => fetchPage(page)}>
                                                            {page}
                                                        </button>
                                                    </li>
                                                </React.Fragment>
                                            ))}

                                        {/* Next */}
                                        <li className={`page-item ${pagination.current_page === pagination.last_page ? 'disabled' : ''}`}>
                                            <button
                                                className="page-link"
                                                onClick={() => fetchPage(pagination.current_page + 1)}
                                                disabled={pagination.current_page === pagination.last_page}
                                            >
                                                »
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            )}



                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Courses;

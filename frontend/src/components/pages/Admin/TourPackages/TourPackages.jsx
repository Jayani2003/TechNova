import { useEffect, useMemo, useState } from 'react';
import AdminPackageDeleteModal from "./AdminPackageDeleteModal";
import AdminPackageFilters from "./AdminPackageFilters";
import AdminPackageFormModal from "./AdminPackageFormModal";
import AdminPackageHero from "./AdminPackageHero";
import AdminPackageTable from "./AdminPackageTable";
import { adminFilter, packageStore } from './adminPackagesData';

function TourPackages() {
	const [packages, setPackages] = useState([]);
	const [search, setSearch] = useState('');
	const [activeType, setActiveType] = useState('All');
	const [activeDays, setActiveDays] = useState('All');
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [editingPackage, setEditingPackage] = useState(null);
	const [deletingPackage, setDeletingPackage] = useState(null);

	useEffect(() => {
		const unsubscribe = packageStore.subscribe((next) => setPackages(next));
		return unsubscribe;
	}, []);

	const filteredPackages = useMemo(() => {
		return adminFilter(packages, {
			search,
			type: activeType,
			days: activeDays,
		});
	}, [packages, search, activeType, activeDays]);

	const handleAddNew = () => {
		setEditingPackage(null);
		setIsFormOpen(true);
	};

	const handleEdit = (pkg) => {
		setEditingPackage(pkg);
		setIsFormOpen(true);
	};

	const handleSave = (data) => {
		if (editingPackage?.id) {
			packageStore.update(editingPackage.id, data);
		} else {
			packageStore.create(data);
		}
		setIsFormOpen(false);
		setEditingPackage(null);
	};

	const handleDeleteConfirm = (id) => {
		packageStore.delete(id);
		setDeletingPackage(null);
	};

	const handleResetFilters = () => {
		setSearch('');
		setActiveType('All');
		setActiveDays('All');
	};

	return (
		<>
		<AdminPackageHero
			total={packages.length}
			onAddNew={handleAddNew}
		/>
		<AdminPackageFilters
			search={search}
			onSearch={setSearch}
			activeType={activeType}
			onTypeChange={setActiveType}
			activeDays={activeDays}
			onDaysChange={setActiveDays}
			total={packages.length}
			filtered={filteredPackages.length}
			onReset={handleResetFilters}
		/>
		<AdminPackageTable
			packages={filteredPackages}
			onEdit={handleEdit}
			onDelete={setDeletingPackage}
		/>
		<AdminPackageFormModal
			isOpen={isFormOpen}
			pkg={editingPackage}
			onSave={handleSave}
			onClose={() => {
				setIsFormOpen(false);
				setEditingPackage(null);
			}}
		/>
		<AdminPackageDeleteModal
			pkg={deletingPackage}
			onConfirm={handleDeleteConfirm}
			onCancel={() => setDeletingPackage(null)}
		/>
		
		
		
		
		</>
	);
}

export default TourPackages;

import { useEffect, useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import AdminPackageDeleteModal from "./AdminPackageDeleteModal";
import AdminPackageFilters from "./AdminPackageFilters";
import AdminPackageFormModal from "./AdminPackageFormModal";
import AdminPackageHero from "./AdminPackageHero";
import AdminPackageTable from "./AdminPackageTable";
import { adminFilter, packageStore } from './adminPackagesData';

function TourPackages() {
	const dark = useOutletContext()?.dark ?? false;
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
		<div className={dark ? 'min-h-screen bg-[#020617]' : 'min-h-screen bg-[#f8fafc]'}>
		<AdminPackageHero
			dark={dark}
			total={packages.length}
			onAddNew={handleAddNew}
		/>
		<AdminPackageFilters
			dark={dark}
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
			dark={dark}
			packages={filteredPackages}
			onEdit={handleEdit}
			onDelete={setDeletingPackage}
		/>
		<AdminPackageFormModal
			dark={dark}
			isOpen={isFormOpen}
			pkg={editingPackage}
			onSave={handleSave}
			onClose={() => {
				setIsFormOpen(false);
				setEditingPackage(null);
			}}
		/>
		<AdminPackageDeleteModal
			dark={dark}
			pkg={deletingPackage}
			onConfirm={handleDeleteConfirm}
			onCancel={() => setDeletingPackage(null)}
		/>
		</div>
	);
}

export default TourPackages;

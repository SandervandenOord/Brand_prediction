-- A.business user map in scheduler
SET mapred.job.queue.name business; ---zorgt ervoor dat je in de business pool komt, bepaalt hoeveel mappers en reducers je krijgt
SET pig.pretty.print.schema true;
SET DEFAULT_PARALLEL 32;

REGISTER '/home/svandenoord/merken2/pyUDF4.py' using jython as pyUDF;

Categories = load 'hbase://financecategory_pro_public_v1_ProductFinanceCategoryCurrent'
    USING org.apache.pig.backend.hadoop.hbase.HBaseStorage('
            f:global_id,
			f:unit,
            f:product_category,
			f:product_group,
			f:product_subgroup
		')
        AS(
            global_id:chararray,
			unit:chararray,
            category:chararray,
			prodgroup:chararray,
			subgroup:chararray
			
        );
		
Categories_Filtered = FOREACH (FILTER Categories BY (unit != 'Books & Entertainment')) GENERATE global_id, unit, category, prodgroup, subgroup;
		
Offers = load 'hbase://productoffer_pro_public_v1.0_SellingOffers'
    USING org.apache.pig.backend.hadoop.hbase.HBaseStorage('
            f:GlobalId,
			f:IsValid,
            f:SellingOfferData.IsOrderable
		')
        AS(
            id_o:chararray,
			valid:chararray,
            o_status:chararray
        );

OffersFilteredIds = foreach ( FILTER Offers BY ( o_status == 'Y' and valid == 'Y' )) generate id_o;
OffersFilteredUniqueIds = DISTINCT OffersFilteredIds;

Products = LOAD 'hbase://PCS_pro_public_v1.0_PRODUCTS'
    USING org.apache.pig.backend.hadoop.hbase.HBaseStorage('
            f:id,
            f:attributes.Description.values_0_value.value,
            f:name,
            f:attributes.Publishing_Status.values_0_value.value,
			f:referenceTypes.Brand.references_0_reference.id,
			f:referenceTypes.Brand.references_0_reference.name,
			f:referenceTypes.Primary_Publisher.references_0_reference.id,
			f:referenceTypes.Primary_Publisher.references_0_reference.name,
			f:attributes.EAN.values_0_value.value,
			f:attributes.Parent_ID.values_0_value.value,
			f:attributes.GPC_Chunk_ID.values_0_value.value,
			f:attributes.GPC_Brick_ID.values_0_value.value
        ')
        AS(
            id_p:chararray,
            description:chararray,
            name:chararray,
            p_status:chararray,
			brand_id:chararray,
			brand_name:chararray,
			publisher_id:chararray,
			publisher_name:chararray,
			ean:chararray,
			parent_id:chararray,
			chunk_id:chararray,
			brick_id:chararray
        );
				
ProductsFilter = FILTER Products BY ( p_status == 'Y' );

ProductsFiltered = FOREACH ProductsFilter GENERATE
					id_p, 
					REPLACE(REPLACE(description, '\n',''),'\u0001','') as description, ---dit is nodig omdat Pig verkeerd omgaat met \n en ctrl-A delimiter (\u0001) in tekst zelf. Die gebruik ik zelf ook als delimiter
					REPLACE(REPLACE(name, '\n',''),'\u0001','') as name, 
					p_status..brick_id;

FinalProductsSelected = JOIN ProductsFiltered BY id_p, OffersFilteredUniqueIds BY id_o, Categories_Filtered BY global_id;

--DESCRIBE FinalProductsSelected;

--STORE FinalProductsSelected INTO 'ProductsCurrent14' using PigStorage('\u0001');

Products_DEF = FOREACH FinalProductsSelected GENERATE
                    id_p,
                    pyUDF.strip_accents(name) as name,
                    pyUDF.strip_accents(description) as description,
					brand_id as brand_id,
					brand_name as brand_name,
					publisher_id as publisher_id,
					publisher_name as publisher_name,
					ean as ean,
					parent_id as parent_id,
					chunk_id as chunk_id,
					brick_id as brick_id,
					unit as unit,
					category as category,
					prodgroup as prodgroup,
					subgroup as subgroup
                    ;
			
STORE Products_DEF INTO 'ProductsDEF10' using PigStorage('\u0001');


# Brand_prediction

This is the webapp that shows the results of brand predictions in a webapp. 
Unfortunately the pickled model (all_models_beauty.pkl) could not be uploaded because it was too large.

Files for getting products:
- allProducts_leverbaar2.pig is a pig script for getting all Products that are deliverable from an HBase storage
- pyUDF4.py is for cleaning up descriptions with very raw text

Files for webapp:
- index.html is the frontend of the webapp for predictions
- folder /Static contains all css / js (Angular) for the webapp 
- brand_predict.py is launching the Flask service (locally) that also makes predictions per brand
- brand_translator2.pkl is a dictionary that translates a brand_id to a brand_name (to make predictions more readable)

